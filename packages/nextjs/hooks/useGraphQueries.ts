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
    pets {
      id
      tokenId
      name
      breed
      color
      description
      imageUrl
      latitude
      longitude
      isLost
      reward
      owner
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
      imageUrl
      latitude
      longitude
      isLost
      reward
      owner
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
      sightingId
      user
      latitude
      longitude
      description
      imageUrl
      isVerified
      timestamp
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
}

const GET_USER_MINTED_PETS = `
  query GetUserMintedPets($userAddress: String!) {
    pets(where: { owner: $userAddress }) {
      id
      tokenId
      name
      breed
      color
      description
      imageURI
      isLost
    }
  }
`;

export function useUserMintedPets(userAddress: string) {
  return useQuery({
    queryKey: ['userPets', userAddress],
    queryFn: async () => {
      try {
        const response = await fetchGraphQL(GET_USER_MINTED_PETS, { userAddress });
        return response || { pets: [] };
      } catch (error) {
        return { pets: [] };
      }
    },
    refetchInterval: 5000,
    enabled: !!userAddress, // Only run query if we have an address
  });
}