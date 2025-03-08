# 🐾 PawChain - Decentralized Pet Recovery System （Scroll down to the bottom to check out the links)

## Table of Contents
- [Key Features](#-key-features)
- [The Graph Integration](#-the-graph-integration)
- [Quick Start](#-quick-start)
- [Contributing](#-contributing)
- [FAQ](#-faq)
- [License](#-license)

PawChain leverages Scroll's zk-rollup technology to provide a scalable, cost-efficient, and secure solution for pet identification, ownership verification, and lost & found tracking. Built on Scroll's Layer 2 solution, PawChain ensures minimal transaction costs while maintaining Ethereum's security guarantees.

## 🌟 Key Features

- **🚀 Pet NFTs as Digital Identities**
  - Soulbound NFTs for immutable proof of ownership
  - Tamper-proof pet identification
  - Permanent record of pet history

- **🔗 Trustless Reward System**
  - Automated smart contract payouts
  - Verified finder rewards
  - Transparent transaction history

- **🌍 Community-Driven Recovery**
  - Decentralized lost & found reports


- **💰 Gas-Efficient Operations**
  - Optimized for Scroll's zkEVM
  - Low-cost NFT minting
  - Affordable transaction processing

- **⚡ Scalability & Performance**
  - Fast finality for real-time updates
  - Seamless user experience
  - Enterprise-grade reliability

## 📊 The Graph Integration

PawChain leverages The Graph's subgraphs for efficient data indexing and retrieval, ensuring real-time access to on-chain pet data:

- **🔹 Pet NFTs Subgraph**
  - Indexes all minted pet NFTs
  - Tracks ownership history
  - Stores detailed pet metadata
  - [View Subgraph](your-pet-nfts-subgraph-link)

- **🔹 Lost & Found Reports Subgraph**
  - Real-time lost pet case tracking
  - Found pet report indexing
  - Geographic location mapping
  - [View Subgraph](your-lost-found-subgraph-link)

- **🔹 Verified Recoveries Subgraph**
  - Records successful pet recoveries
  - Tracks reward distributions
  - Stores finder verification data
  - [View Subgraph](your-recoveries-subgraph-link)

## 🔧 Technical Stack

- **Frontend**: 
  - Next.js
  - RainbowKit
  - Wagmi

- **Backend & Data**:
  - The Graph Protocol
  - GraphQL
  - Subgraph Indexing

- **Smart Contracts**: 
  - Solidity
  - Foundry

- **Network**: 
  - Scroll Sepolia Testnet

- **Tools**: 
  - TypeScript

## 📦 Prerequisites

Before you begin, ensure you have installed:
- [Node.js](https://nodejs.org/) (>= v20.18.3)
- [Yarn](https://yarnpkg.com/) (v1 or v2+)
- [Git](https://git-scm.com/)

## 🚀 Quick Start

1. **Clone the Repository**
   ```bash
   git clone https://github.com/yeexiong17/eth-uprising-hackathon.git
   cd eth-uprising-hackathon
   ```

2. **Install Dependencies**
   ```bash
   yarn install
   ```

3. **Environment Setup**
   ```bash
   # Copy environment files
   cp packages/foundry/.env.example packages/foundry/.env
   cp packages/nextjs/.env.example packages/nextjs/.env

   # Configure your environment variables
   # packages/foundry/.env
   PRIVATE_KEY=your_wallet_private_key
   ALCHEMY_API_KEY=your_alchemy_api_key
   ETHERSCAN_API_KEY=your_etherscan_api_key

   # packages/nextjs/.env
   NEXT_PUBLIC_MAPBOX_TOKEN=YOUR_MAPBOX_TOKEN
   NEXT_PUBLIC_PINATA_TOKEN=YOUR_PINATA_TOKEN
   NEXT_PUBLIC_SUBGRAPH_URL="https://api.studio.thegraph.com/query/105170/pawchain/version/latest"\
   ```

4. **Start the Frontend**
   ```bash
   yarn start
   ```

## 📊 Querying Subgraphs

Example GraphQL queries for common operations:

```graphql
# Query Pet NFT Details
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
```

## 📦 Project Structure

```
pawchain/
├── packages/
│   ├── foundry/          # Smart contracts
│   ├── nextjs/           # Frontend application
│   └── pawchain/         # The Graph subgraphs
```

## 🔍 Contract Details

- **Network**: Scroll Sepolia Testnet
- **Contract Address**: 0x0EF565022d896A14f8D26110841D5da8d8b6A0FE
- **ScrollScan Link**: https://sepolia.scrollscan.com/address/0x0EF565022d896A14f8D26110841D5da8d8b6A0FE

## 🧪 Testing

```bash
# Run contract tests
cd packages/foundry
yarn test

# Run frontend tests
cd packages/nextjs
yarn test
```

## 🌐 Network Configuration

PawChain is deployed on Scroll Sepolia testnet with the following configuration:
- **RPC URL**: https://sepolia-rpc.scroll.io
- **Chain ID**: 534351
- **Network Name**: scrollSepolia

## 🎯 Getting Testnet ETH

1. Visit [Scroll Sepolia Faucet](https://sepolia.scroll.io/faucet)
2. Connect your wallet
3. Request test ETH for development and testing

## 📚 Development Commands

```bash
# Start local blockchain
yarn chain

# Deploy contracts
yarn deploy

# Start frontend
yarn start

# Run tests
yarn test

# Verify contracts
yarn verify

# Subgraph Commands
cd packages/subgraph

# Generate types
yarn codegen

# Deploy subgraphs
yarn deploy:pet-nfts
yarn deploy:lost-found
yarn deploy:recoveries

# Create local subgraph
yarn create-local

# Remove local subgraph
yarn remove-local
```

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Scaffold-ETH 2](https://github.com/scaffold-eth/scaffold-eth-2)
- Powered by [Scroll](https://scroll.io/)
- Supported by the Ethereum community

## 🤔 Support

For support, please join our [Discord Community](your-discord-link) or open a GitHub issue.

## 🔍 Verification & Deployment Links

- **Smart Contract**
  - Network: Scroll Sepolia Testnet
  - Contract Address: 0x0EF565022d896A14f8D26110841D5da8d8b6A0FE
  - ScrollScan Link: https://sepolia.scrollscan.com/address/0x0EF565022d896A14f8D26110841D5da8d8b6A0FE
  - Video Pitch: https://www.youtube.com/watch?v=iCUYbW3heZw 

- **Subgraphs**
  - PawChain: https://api.studio.thegraph.com/query/105170/pawchain/version/latest
  - Subgraph Code Link: https://github.com/yeexiong17/eth-uprising-hackathon/tree/main/packages/pawchain
  - Video Pitch: https://www.youtube.com/watch?v=iCUYbW3heZw 
    
