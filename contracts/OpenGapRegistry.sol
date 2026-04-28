// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract OpenGapRegistry {
    event ImprovementRecorded(
        bytes32 indexed traceHash,
        string storageRoot,
        bytes32 indexed contentHash,
        string artifactType,
        address indexed recorder
    );

    function recordImprovement(
        bytes32 traceHash,
        string calldata storageRoot,
        bytes32 contentHash,
        string calldata artifactType
    ) external {
        emit ImprovementRecorded(traceHash, storageRoot, contentHash, artifactType, msg.sender);
    }
}

