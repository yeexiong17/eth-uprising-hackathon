import {
  PetMinted as PetMintedEvent,
  PetReportedLost as PetReportedLostEvent,
  PetSighted as PetSightedEvent,
  PetVerified as PetVerifiedEvent,
  RewardDistributed as RewardDistributedEvent,
  YourContract,
  Transfer as TransferEvent
} from "../generated/YourContract/YourContract"
import {
  Pet,
  LostReport,
  Sighting,
  RewardDistribution
} from "../generated/schema"
import { BigInt } from "@graphprotocol/graph-ts"

export function handlePetMinted(event: PetMintedEvent): void {
  let pet = new Pet(event.params.tokenId.toString())

  // Load contract to get additional pet details
  let contract = YourContract.bind(event.address)
  let petData = contract.pets(event.params.tokenId)

  pet.tokenId = event.params.tokenId
  pet.name = petData.getName()
  pet.breed = petData.getBreed()
  pet.color = petData.getColor()
  pet.description = petData.getDescription()
  pet.imageURI = petData.getImageURI()
  pet.owner = petData.getOwner()
  pet.isLost = false
  pet.createdAt = event.block.timestamp
  pet.updatedAt = event.block.timestamp

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

  // Get contract instance to fetch sighting details
  let contract = YourContract.bind(event.address)
  let sightingData = contract.sightingList(event.params.tokenId, BigInt.fromI32(event.params.user.toI32()))

  sighting.pet = event.params.tokenId.toString()
  sighting.tokenId = event.params.tokenId
  sighting.spotter = event.params.user
  sighting.latitude = event.params.latitude
  sighting.longitude = event.params.longitude
  sighting.description = sightingData.getSighting().description
  sighting.imageURI = sightingData.getSighting().imageURI
  sighting.isVerified = false
  sighting.createdAt = event.block.timestamp

  // Link to current lost report
  let pet = Pet.load(event.params.tokenId.toString())
  if (pet && pet.currentLostReport) {
    sighting.lostReport = pet.currentLostReport as string
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
    let sighting = Sighting.load(sightings[i].sighting.sightingId.toString())
    if (sighting && !sighting.isVerified) {
      sighting.isVerified = true
      sighting.verifiedBy = event.params.verifier
      sighting.verifiedAt = event.block.timestamp
      sighting.save()
    }
  }
}

export function handleRewardDistributed(event: RewardDistributedEvent): void {
  let id = event.transaction.hash.concatI32(event.logIndex.toI32()).toHexString()
  let distribution = new RewardDistribution(id)
  let pet = Pet.load(event.params.tokenId.toString())

  if (pet && pet.currentLostReport) {
    let lostReport = LostReport.load(pet.currentLostReport as string)
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

  // Get contract to fetch verification details
  let contract = YourContract.bind(event.address)
  let verifiers = contract.verifications(event.params.tokenId, new BigInt(0))

  distribution.pet = event.params.tokenId.toString()
  distribution.tokenId = event.params.tokenId
  distribution.totalReward = event.params.totalReward
  distribution.distributedAt = event.block.timestamp
  distribution.recipients = [verifiers]

  distribution.save()
}

export function handleTransfer(event: TransferEvent): void {
  let pet = Pet.load(event.params.tokenId.toString())
  if (pet) {
    pet.owner = event.params.to
    pet.updatedAt = event.block.timestamp
    pet.save()
  }
}
