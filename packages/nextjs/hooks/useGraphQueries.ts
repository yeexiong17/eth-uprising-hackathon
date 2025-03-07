import { useQuery } from '@tanstack/react-query';

const SUBGRAPH_URL = process.env.NEXT_PUBLIC_SUBGRAPH_URL || "";

async function fetchGraphQL(query: string, variables = {}) {
  const response = await fetch(SUBGRAPH_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  const data = await response.json();
  if (data.errors) {
    throw new Error(data.errors[0].message);
  }
  return data.data;
}

const GET_ALL_LOST_PETS = `
  query GetAllLostPets {
    pets(where: { isLost: true }) {
      id
      tokenId
      name
      breed
      color
      description
      imageURI
      owner
      isLost
      reward
    }
  }
`;

export function useAllLostPets() {
  return useQuery({
    queryKey: ['pets'],
    queryFn: async () => {
      const response = await fetchGraphQL(GET_ALL_LOST_PETS);
      console.log('GraphQL Response:', response);
      return response;
    },
    refetchInterval: 5000,
  });
}

const GET_LOST_PET = `
  query GetLostPet($petId: ID!) {
    pet(id: $petId) {
      id
      tokenId
      name
      breed
      color
      description
      imageURI
      owner
      isLost
      reward
    }
  }
`;

export function useLostPet(petId: string) {
  return useQuery({
    queryKey: ['pet', petId],
    queryFn: () => fetchGraphQL(GET_LOST_PET, { petId }),
    refetchInterval: 5000,
  });
}

const GET_PET_SIGHTINGS = `
  query GetPetSightings($petId: ID!) {
    sightings(where: { pet: $petId }) {
      id
      tokenId
      spotter
      latitude
      longitude
      description
      imageURI
      isVerified
      createdAt
    }
  }
`;

export function usePetSightings(petId: string) {
  return useQuery({
    queryKey: ['sightings', petId],
    queryFn: () => fetchGraphQL(GET_PET_SIGHTINGS, { petId }),
    refetchInterval: 5000,
  });
}

export interface Pet {
  id: string;
  tokenId: string;
  name: string;
  breed: string;
  color: string;
  description: string;
  imageURI: string;
  isLost: boolean;
  owner: string;
}

const GET_USER_MINTED_PETS = `
  query GetUserMintedPets($userAddress: Bytes!) {
    pets(where: { owner: $userAddress }) {
      id
      tokenId
      name
      breed
      color
      description
      imageURI
    }
  }
`;

export function useUserMintedPets(userAddress: string) {
  return useQuery({
    queryKey: ['userPets', userAddress],
    queryFn: async () => {
      if (!userAddress) return { pets: [] };

      try {
        // Convert address to lowercase to match The Graph's format
        const formattedAddress = userAddress.toLowerCase();
        console.log('Querying for address:', formattedAddress);

        const response = await fetchGraphQL(GET_USER_MINTED_PETS, { userAddress: formattedAddress });
        console.log('GraphQL Response:', response);
        return response || { pets: [] };
      } catch (error) {
        console.error('Error fetching user pets:', error);
        return { pets: [] };
      }
    },
    refetchInterval: 5000,
    enabled: !!userAddress, // Only run query if we have an address
  });
}