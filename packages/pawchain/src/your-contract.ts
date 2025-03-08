import {
  PetMinted as PetMintedEvent,
  PetReportedLost as PetReportedLostEvent,
  PetSighted as PetSightedEvent,
  PetVerified as PetVerifiedEvent,
  RewardDistributed as RewardDistributedEvent,
  YourContract,
} from "../generated/YourContract/YourContract"
import {
  Pet,
  LostReport,
  Sighting,
  RewardDistribution
} from "../generated/schema"
import { BigInt, Bytes, store, Address } from "@graphprotocol/graph-ts"

export function handlePetMinted(event: PetMintedEvent): void {
  let pet = new Pet(event.params.tokenId.toString())

  // Load contract to get additional pet details
  let contract = YourContract.bind(event.address)
  let petData = contract.pets(event.params.tokenId)

  // Map the data correctly according to the Pet struct in the smart contract
  pet.tokenId = petData.getTokenId()
  pet.name = petData.getName()
  pet.breed = petData.getBreed()
  pet.color = petData.getColor()
  pet.description = petData.getDescription()
  pet.imageURI = petData.getImageURI()
  pet.owner = petData.getOwner()
  pet.isLost = false
  pet.createdAt = event.block.timestamp
  pet.updatedAt = event.block.timestamp
  pet.reward = BigInt.fromI32(0) // Initialize reward to 0

  pet.save()
}

export function handlePetReportedLost(event: PetReportedLostEvent): void {
  let id = event.transaction.hash.concatI32(event.logIndex.toI32()).toHexString()
  let lostReport = new LostReport(id)
  let pet = Pet.load(event.params.tokenId.toString())

  if (pet) {
    pet.isLost = true
    pet.updatedAt = event.block.timestamp
    pet.currentLostReport = id
    pet.save()
  }

  let contract = YourContract.bind(event.address)
  let rewardAmount = contract.rewardPool(event.params.tokenId)

  lostReport.pet = event.params.tokenId.toString()
  lostReport.tokenId = event.params.tokenId
  lostReport.isLost = true
  lostReport.reward = rewardAmount
  lostReport.latitude = event.params.latitude
  lostReport.longitude = event.params.longitude
  lostReport.reportedAt = event.block.timestamp

  lostReport.save()
}

export function handlePetSighted(event: PetSightedEvent): void {
  let id = event.transaction.hash.concatI32(event.logIndex.toI32()).toHexString()
  let sighting = new Sighting(id)

  sighting.pet = event.params.tokenId.toString()
  sighting.tokenId = event.params.tokenId
  sighting.spotter = event.params.user
  sighting.latitude = event.params.latitude
  sighting.longitude = event.params.longitude

  // Get sighting details from contract
  let contract = YourContract.bind(event.address)
  let sightingList = contract.getSightings(event.params.tokenId)

  // Find the matching sighting for this user
  for (let i = 0; i < sightingList.length; i++) {
    if (sightingList[i].user == event.params.user) {
      sighting.description = sightingList[i].sighting.description
      sighting.imageURI = sightingList[i].sighting.imageURI
      break
    }
  }

  sighting.isVerified = false
  sighting.createdAt = event.block.timestamp

  // Link to current lost report
  let pet = Pet.load(event.params.tokenId.toString())
  if (pet && pet.currentLostReport) {
    sighting.lostReport = pet.currentLostReport
  }

  sighting.save()
}

export function handlePetVerified(event: PetVerifiedEvent): void {
  let pet = Pet.load(event.params.tokenId.toString())
  if (!pet) return

  // Update all unverified sightings by this verifier
  let contract = YourContract.bind(event.address)
  let sightings = contract.getSightings(event.params.tokenId)

  for (let i = 0; i < sightings.length; i++) {
    let sightingData = sightings[i]
    if (sightingData.user == event.params.verifier) {
      let sightingId = sightingData.sighting.sightingId.toString()
      let sighting = Sighting.load(sightingId)
      if (sighting && !sighting.isVerified) {
        sighting.isVerified = true
        sighting.verifiedBy = event.params.verifier
        sighting.verifiedAt = event.block.timestamp
        sighting.save()
      }
    }
  }
}

export function handleRewardDistributed(event: RewardDistributedEvent): void {
  let id = event.transaction.hash.concatI32(event.logIndex.toI32()).toHexString()
  let distribution = new RewardDistribution(id)
  let pet = Pet.load(event.params.tokenId.toString())

  if (pet) {
    let currentLostReport = pet.currentLostReport
    if (currentLostReport) {
      let lostReport = LostReport.load(currentLostReport)
      if (lostReport) {
        lostReport.isLost = false
        lostReport.resolvedAt = event.block.timestamp
        lostReport.save()
      }

      pet.isLost = false
      pet.currentLostReport = null
      pet.updatedAt = event.block.timestamp
      pet.save()
    }
  }

  // Get contract to fetch verification details
  let contract = YourContract.bind(event.address)
  let recipients: Bytes[] = []

  // Since we can't get the array length directly, we'll use a try-catch approach
  let i = 0
  while (true) {
    let verifierResult = contract.try_verifications(event.params.tokenId, BigInt.fromI32(i))
    if (verifierResult.reverted) {
      break
    }
    recipients.push(verifierResult.value)
    i++
  }

  distribution.pet = event.params.tokenId.toString()
  distribution.tokenId = event.params.tokenId
  distribution.totalReward = event.params.totalReward
  distribution.distributedAt = event.block.timestamp
  distribution.recipients = recipients

  distribution.save()
}
