pragma solidity ^0.4.8;
contract GenesScience {
    
    event ValueLogger(bytes2);
    event GenesLogger(bytes32);
    event LooksLogger(string);
    event PossibilityLogger(uint16);
    uint256 hash = 0;
    uint seed = 20;
    bool isMatingSeason = false;
    
    function isGeneScience() public pure returns (bool){
        return true;
    }
        
    //get first 6 digits of hex this is the genes in charge of attribute
    function getAttribute(bytes32 source) pure public  returns (bytes3){
        bytes3[2] memory y = [bytes3(0),0];
        assembly {
            mstore(y, source)
            mstore(add(y, 30), source)
        }
        return y[1];
    }
    
    //index of hex for looks is 27, 25, 23, 21, 19, 17, 15, 13, 11, 9, 7
    function getLooks(bytes32 source, uint index) pure public  returns (bytes2) {
        uint8[11] memory positionList = [27, 25, 23, 21, 19, 17, 15, 13, 11, 9, 7]; 
        bytes2[2] memory y = [bytes2(0), 0];
        uint8 position = positionList[index]; 
        assembly {
            mstore(y, source)
            mstore(add(y, position), source)
        }
        return y[1];
    }
    

    
    
    //this function will process the mother and father attribute and calculate the possibility of
    //inherit and mutation to come up with the attribute of the child
    function processGeneAttribute(bytes3 momAttr, bytes3 dadAttr) internal returns (bytes3){
        bytes3 childAttribute;
        uint8 randomInherit;
        bytes1 Atrribute1;
        bytes1 Atrribute2;
        
        for (uint i =0; i < 3; i++) {
            Atrribute1 = check_attribute_mutation(momAttr[i],dadAttr[i]);
            if(Atrribute1 == 0x00) {
                randomInherit = rand();
                if(randomInherit < 50) {
                    Atrribute1 = shiftLeft(shiftRight(dadAttr[i]));
                } else {
                    Atrribute1 = shiftLeft(shiftRight(momAttr[i]));
                }
            }
            
            Atrribute2 = check_attribute_mutation(shiftLeft(momAttr[i]),shiftLeft(dadAttr[i]));
            if(Atrribute2 == 0x00) {
                randomInherit = rand();
                if(randomInherit < 50) {
                    Atrribute2 = shiftLeft(dadAttr[i]);
                } else {
                    Atrribute2 = shiftLeft(momAttr[i]);
                }
            }            
            childAttribute = bytes3(uint(childAttribute) 
            + uint(shiftRightForAttribute(bytes3(Atrribute1),i*8)) 
            + uint(shiftRightForAttribute(bytes3(Atrribute2),(i*8) + 4)));
        }        

        return childAttribute;
    } 
    
    
    //this is the process function for the look
    //we process each 4 hex at a time 
    function processChildGenes(bytes2 genesMom,bytes2 genesDad) internal returns (bytes2){
        bytes1 dominant;
        bytes1 recessive1;
        bytes1 recessive2;
        bytes1 recessive3;
        uint8 randomSwap;
        uint8 randomInherit;
        bytes2 completeGenes;
        
        bool isMutated = false;
        //if mutation happend the function will return the mutation code
        //otherwise it will return 0x00
        dominant = check_mutation(genesMom, genesDad);
        
        //if the dominant not mutate then we check the possibility of it being swap
        //if not the child gene will inherit from mother or the father
        if(dominant == 0x00) {
            randomSwap = rand();
            if(randomSwap < 10){
                if(randomSwap <5) {
                    dominant = shiftLeft(genesDad[0]);
                } else {
                    dominant = shiftLeft(genesMom[0]);
                }
            } else {
                randomInherit = rand();
                if(randomInherit < 50) {
                    dominant = shiftLeft(shiftRight(genesDad[0]));
                } else {
                    dominant = shiftLeft(shiftRight(genesMom[0]));
                }
            }
        } else {
            isMutated = true;
        }
        
        
        //the second, third , final hex will not mutate so we only check for swap or inherit
        randomSwap = rand();
        if(randomSwap < 20){
                if(randomSwap <5) {
                    recessive1 = shiftRight(genesDad[0]);
                }else if(randomSwap <10) {
                    recessive1 = shiftRight(shiftLeft(genesDad[1]));
                }else if(randomSwap <15) {
                    recessive1 = shiftRight(genesMom[0]);
                }else{
                    recessive1 = shiftRight(shiftLeft(genesDad[1]));
                }
            } else {
                randomInherit = rand();
                if(randomInherit < 50) {
                    recessive1 = shiftRight(shiftLeft(genesDad[0]));
                } else {
                    recessive1 = shiftRight(shiftLeft(genesMom[0]));
                }
        }
        
        randomSwap = rand();
        if(randomSwap < 20){
                if(randomSwap < 5) {
                    recessive2 = shiftLeft(genesDad[0]);
                }else if(randomSwap <10) {
                    recessive2 = shiftLeft(shiftRight(genesDad[1]));
                }else if(randomSwap <15) {
                    recessive2 = shiftLeft(genesMom[0]);
                }else{
                    recessive2 = shiftLeft(shiftRight(genesDad[1]));
                }
            } else {
                randomInherit = rand();
                if(randomInherit < 50) {
                    recessive2 = shiftLeft(shiftRight(genesDad[1]));
                } else {
                    recessive2 = shiftLeft(shiftRight(genesMom[1]));
                }
        }
        
        randomSwap = rand();
        if(randomSwap < 10){
            if(randomSwap <5) {
                    recessive3 = shiftRight(genesDad[1]);
                }else{
                    recessive3 = shiftRight(genesMom[1]);
                }
            } else {
                randomInherit = rand();
                if(randomInherit < 50) {
                    recessive3 = shiftRight(shiftLeft(genesDad[1]));
                } else {
                    recessive3 = shiftRight(shiftLeft(genesMom[1]));
                }
        }
        
    //after come up with the child genes we will check for duplication possibility
    //there are 2 factors affect the duplication happenning possibility:
    //1. does the father and mother dominant genes mutated
    //2/ does the child dominant mutated
    if( shiftRight(genesMom[0])== 0x0a 
        || shiftRight(genesMom[0]) == 0xb 
        || shiftRight(genesMom[0]) == 0xc
        || shiftRight(genesMom[0]) == 0xd
        || shiftRight(genesMom[0]) == 0xe
        || shiftRight(genesMom[0]) == 0xf
        || shiftRight(genesDad[0]) == 0xa 
        || shiftRight(genesDad[0]) == 0xb 
        || shiftRight(genesDad[0]) == 0xc
        || shiftRight(genesDad[0]) == 0xd
        || shiftRight(genesDad[0]) == 0xe
        || shiftRight(genesDad[0]) == 0xf) {
            completeGenes = processDuplication(dominant,recessive1,recessive2,recessive3,isMutated,true);
        } else {
            completeGenes = processDuplication(dominant,recessive1,recessive2,recessive3,isMutated,false);
        }
        
        return completeGenes;
    }
    

    //this is the actual function process the duplication for the child genes 
    //after the process is finish we join the dominant, recessive1, recessive2,
    //recessive3 together to represent 1 look 
    function processDuplication(
        bytes1 dominant,
        bytes1 recessive1,
        bytes1 recessive2,
        bytes1 recessive3, 
        bool isMutated, 
        bool isParentMutated) internal returns (bytes2) {
        uint8 randomHappening;
        uint8 randomDirection;
        
        uint8 randomDup = rand();
        if(isMutated) {
            if(randomDup < 20) {
                randomHappening = rand();
                if(randomHappening < 70) {
                    randomDirection = rand();
                    if(randomDirection < 85) {
                        recessive2 = shiftLeft(recessive1);
                    } else {
                        recessive1 = shiftRight(recessive2);
                    }
                } else {
                    randomDirection = rand();
                    if(randomDirection < 85) {
                        recessive3 = shiftRight(recessive2);
                    } else {
                        recessive2 = shiftLeft(recessive3);
                    }
                }
            }
        } else if(isParentMutated) {
            if(randomDup < 20) {
                randomHappening = rand();
                if(randomHappening < 5) {
                    randomDirection = rand();
                    if(randomDirection < 85) {
                        dominant = shiftLeft(recessive1);
                    } else {
                        recessive1 = shiftRight(dominant);
                    }
                } else if(randomHappening < 30) {
                    randomDirection = rand();
                    if(randomDirection < 85) {
                        recessive1 = shiftRight(recessive2);
                    } else {
                        recessive2 = shiftLeft(recessive1);
                    }
                } else {
                    randomDirection = rand();
                    if(randomDirection < 85) {
                        recessive2 = shiftLeft(recessive3);
                    } else {
                        recessive3 = shiftRight(recessive2);
                    }
                }
            }
        } else {
            if(randomDup < 20) {
                randomHappening = rand();
                if(randomHappening < 70) {
                    randomDirection = rand();
                    if(randomDirection < 85) {
                        recessive1 = shiftRight(dominant);
                    } else {
                        dominant = shiftLeft(recessive1);
                    }
                } else if(randomHappening < 95) {
                    randomDirection = rand();
                    if(randomDirection < 85) {
                        recessive2 = shiftLeft(recessive1);
                    } else {
                        recessive1 = shiftRight(recessive2);
                    }
                } else {
                    randomDirection = rand();
                    if(randomDirection < 85) {
                        recessive3 = shiftRight(recessive2);
                    } else {
                        recessive2 = shiftLeft(recessive3);
                    }
                }
            }            
        }
        
        //combine dominant with recessive1 and recessive2 with recessive3
        // this process is need before combine the whole thing together 
        bytes2 genelog1 = shiftLeftBy8(bytes2(uint8(dominant)+uint8(recessive1)));
        bytes2 genelog2 = bytes2(uint8(recessive2)+uint8(recessive3));
        
        return bytes2(uint16(genelog1) + uint16(genelog2));
    }
    
    
    //this function check the genes of mom and dad to see if mutation is happen or not
    function check_mutation(bytes2 genesMom, bytes2 genesDad) internal returns (bytes1) {
        //this is the random base on blockhash this will determine the mutation happen or not
        uint randomNumber = rand();
        //this the possibility of mutation happening
        uint8 possibility = 0;
        bytes1 mutation = 0x00;

        //firt we check the D to see if the genes can be mutate or not the if it is possible
        //for the mutation happen 
        if(shiftRight(genesMom[0]) == 0x0 && shiftRight(genesDad[0])== 0x1) {
            possibility = 10 + calculate_possibility(genesMom, genesDad, 0x10, 0x00);
            mutation = 0xa0;
        } else if(shiftRight(genesMom[0]) == 0x1 && shiftRight(genesDad[0])== 0x0) {
            possibility = calculate_possibility(genesMom, genesDad, 0x10, 0x00);
            mutation = 0xa0;
        } else if(shiftRight(genesMom[0]) == 0x2 && shiftRight(genesDad[0])== 0x3) {
            possibility = calculate_possibility(genesMom, genesDad, 0x20, 0x30);
            mutation = 0xb0;
        } else if(shiftRight(genesMom[0]) == 0x3 && shiftRight(genesDad[0])== 0x2) {
            possibility = calculate_possibility(genesMom, genesDad, 0x20, 0x30);
            mutation = 0xb0;
        } else if(shiftRight(genesMom[0]) == 0x4 && shiftRight(genesDad[0])== 0x5) {
            possibility = calculate_possibility(genesMom, genesDad, 0x40, 0x50);
            mutation = 0xc0;
        } else if(shiftRight(genesMom[0]) == 0x5 && shiftRight(genesDad[0])== 0x4) {
            possibility = calculate_possibility(genesMom, genesDad, 0x40, 0x50);
            mutation = 0xc0;
        } else if(shiftRight(genesMom[0]) == 0x6 && shiftRight(genesDad[0])== 0x7) {
            possibility = calculate_possibility(genesMom, genesDad, 0x60, 0x70);
            mutation = 0xd0;
        } else if(shiftRight(genesMom[0]) == 0x7 && shiftRight(genesDad[0])== 0x6) {
            possibility = calculate_possibility(genesMom, genesDad, 0x60, 0x70);
            mutation = 0xd0;
        } else if(shiftRight(genesMom[0]) == 0x8 && shiftRight(genesDad[0])== 0x9) {
            possibility = calculate_possibility(genesMom, genesDad, 0x80, 0x90);
            mutation = 0xe0;
        } else if(shiftRight(genesMom[0]) == 0x9 && shiftRight(genesDad[0])== 0x8) {
            possibility = calculate_possibility(genesMom, genesDad, 0x80, 0x90);
            mutation = 0xe0;
        }
        if(randomNumber < possibility) {
            return mutation;
        } else {
            return;
        }
    }
    
    
    //this function check the genes of mom and dad to see if attribute mutation is happen or not
    function check_attribute_mutation(bytes1 genesMom, bytes1 genesDad) internal returns (bytes1) {
        //this is the random base on blockhash this will determine the mutation happen or not
        uint randomNumber = rand();
        //this the possibility of mutation happening
        uint8 possibility = 5;
        bytes1 mutation = 0x00;

        //firt we check the D to see if the genes can be mutate or not the if it is possible
        //for the mutation happen 
        if(shiftRight(genesMom) == 0x0 && shiftRight(genesDad)== 0x1) {
            mutation = 0xa0;
        } else if(shiftRight(genesMom) == 0x1 && shiftRight(genesDad[0])== 0x0) {
            mutation = 0xa0;
        } else if(shiftRight(genesMom) == 0x2 && shiftRight(genesDad[0])== 0x3) {
            mutation = 0xb0;
        } else if(shiftRight(genesMom) == 0x3 && shiftRight(genesDad[0])== 0x2) {
            mutation = 0xb0;
        } else if(shiftRight(genesMom) == 0x4 && shiftRight(genesDad[0])== 0x5) {
            mutation = 0xc0;
        } else if(shiftRight(genesMom) == 0x5 && shiftRight(genesDad[0])== 0x4) {
            mutation = 0xc0;
        } else if(shiftRight(genesMom) == 0x6 && shiftRight(genesDad[0])== 0x7) {
            mutation = 0xd0;
        } else if(shiftRight(genesMom) == 0x7 && shiftRight(genesDad[0])== 0x6) {
            mutation = 0xd0;
        } else if(shiftRight(genesMom) == 0x8 && shiftRight(genesDad[0])== 0x9) {
            mutation = 0xe0;
        } else if(shiftRight(genesMom) == 0x9 && shiftRight(genesDad[0])== 0x8) {
            mutation = 0xe0;
        }
        if(randomNumber < possibility) {
            return mutation;
        } else {
            return;
        }
    }    
    
    //this function calculate the possibility of mutation base on the R1, R2 and R3 in the genes
    function calculate_possibility(bytes2 genesMom, bytes2 genesDad, bytes1 checkBit1, bytes1 checkBit2) internal pure returns (uint8) {
        if((shiftLeft(genesMom[0]) == checkBit1 && shiftLeft(genesDad[0])== checkBit2) 
        || (shiftLeft(genesMom[0]) == checkBit2 && shiftLeft(genesDad[0])== checkBit1)) {
            //for the R2 we need to shiftLeft then shiftRight so it can be compare with the checkBit 
            if((shiftLeft(shiftRight(genesMom[1])) == checkBit1 && shiftLeft(shiftRight(genesDad[1]))== checkBit2) 
            || (shiftLeft(shiftRight(genesMom[1])) == checkBit2 && shiftLeft(shiftRight(genesDad[1]))== checkBit1)) {
                if((shiftLeft(genesMom[1]) == checkBit1 && shiftLeft(genesDad[1])== checkBit2) 
                || (shiftLeft(genesMom[1]) == checkBit2 && shiftLeft(genesDad[1])== checkBit1)) {
                    return 25;
                }
                return 17;
            }
            if((shiftLeft(genesMom[1]) == checkBit1 && shiftLeft(genesDad[1])== checkBit2) 
                || (shiftLeft(genesMom[1]) == checkBit2 && shiftLeft(genesDad[1])== checkBit1)) {
                return 15;        
            }
            return 10;
        } else if((shiftLeft(shiftRight(genesMom[1])) == checkBit1 && shiftLeft(shiftRight(genesDad[1]))== checkBit2) 
            || (shiftLeft(shiftRight(genesMom[1])) == checkBit2 && shiftLeft(shiftRight(genesDad[1]))== checkBit1)) {
                if((shiftLeft(genesMom[1]) == checkBit1 && shiftLeft(genesDad[1])== checkBit2) 
                || (shiftLeft(genesMom[1]) == checkBit2 && shiftLeft(genesDad[1])== checkBit1)) {
                    return 7;
                }
                return 5;
            } else if((shiftLeft(genesMom[1]) == checkBit1 && shiftLeft(genesDad[1])== checkBit2) 
                    || (shiftLeft(genesMom[1]) == checkBit2 && shiftLeft(genesDad[1])== checkBit1)) {
                        return 1;
            } else {
            return 0;
            }
    }
    
    //this is the function we use to calculate the random number from 0-100 to determine the mutation, swap or inherit happenning
    //this function using the blockhash code and a seed to generate the random number
    function rand() internal returns (uint8) {
        uint8 num = uint8(keccak256(abi.encodePacked(hash,seed)))% uint8(100) + uint8(1);
        seed = num;
        return num;
    }
    
    //the following function is used for bitwise operation this is necessary for dividing the genes and also combine it 
    //shift bytes to the right 4 bits
    function shiftRight(bytes1 a) internal pure returns (bytes1) {
        uint8 n = 4;
        uint shifted = uint8(a) / uint8(2) ** n;
        return bytes1(shifted);
    }
   
    
    //shift bytes to left 4 bits
    function shiftLeft(bytes1 a) internal pure returns (bytes1) {
        uint8 n = 4;
        uint8 shifted = uint8(a) * uint8(2) ** n;
        return bytes1(shifted);
    }  
    
  //shift bytes to the right 8 bits
    function shiftLeftBy8(bytes2 a) internal pure returns (bytes2) {
        uint16 n = 8;
        uint16 shifted = uint16(a) * uint16(2) ** n;
        return bytes2(shifted);
    }
    
    //this fucntion is used to shift bytes 32
    function shiftRightByN(bytes32 a, uint n) internal pure returns (bytes32) {
        uint256 shifted = uint256(a) / 2 ** n;
        return bytes32(shifted);
    }
    
    //this function is only used to shift the attribute genes to the right
    function shiftRightForAttribute(bytes3 a, uint n) internal pure returns (bytes3) {
        uint256 shifted = uint256(a) / 2 ** n;
        return bytes3(shifted);
    }    
    
    //this function process the mother genes and the father genes and come out with the child genes
    function mixGenes(uint256 mom, uint256 dad, uint256 targetBlock) public returns (uint256) {
        bytes32 genesMom = bytes32(mom);
        bytes32 genesDad = bytes32(dad);
        bytes32 childGenes;
        bytes3 childAttribute;
        
        hash = targetBlock;
        
        require(hash > 0);
        childAttribute = processGeneAttribute(getAttribute(genesMom), getAttribute(genesDad));
        childGenes = bytes32(uint(childGenes)+ uint(shiftRightByN(childAttribute,16)));
        //loop through the look of mother and father and process it to generate child genes
        for (uint i =0; i < 11; i++) {
            uint shiftNum = 40 + (i * 16);
            bytes2 child = processChildGenes(getLooks(genesMom,i),getLooks(genesDad,i));
            childGenes = bytes32(uint(childGenes)+ uint(shiftRightByN(bytes32(child),shiftNum )));
        }
        emit GenesLogger(childGenes);

        return uint256(childGenes);
    }

    function processCooldown(uint16 childGen, uint256 targetBlock) public returns (uint16) {
        uint16 index = childGen / 2;
        uint8 randomCooldown;

        hash = targetBlock;
        randomCooldown = rand();
        if(isMatingSeason) {
            if (index > 9) {
                index = 9;
            }

            if(index == 0){
                if(randomCooldown < 12) {
                    index = index + 1;
                } else if(randomCooldown < 20){
                    index = index + 2;
                }
            } else {
                if(randomCooldown < 10) {
                    index = index - 1;
                } else if(randomCooldown < 17) {
                    index = index + 1;
                } else if(randomCooldown <20) {
                    index = index + 2;
                }
            }

            if (index > 9) {
                index = 9;
            }
        } else {
            if (index > 9) {
                index = 9;
            }

            if(index == 0){
                if(randomCooldown < 50) {
                    index = index + 1;
                } else if(randomCooldown < 80){
                    index = index + 2;
                }
            } else {
                if(randomCooldown < 5) {
                    index = index - 1;
                } else if(randomCooldown < 55) {
                    index = index + 1;
                } else if(randomCooldown <80) {
                    index = index + 2;
                }
            }

            if (index > 9) {
                index = 9;
            }            
        }    
        
        return index;
    }

    function upgradeDragonResult(uint16 unicornation, uint256 targetBlock) public returns (bool) {
        require(unicornation < 3);

        hash = targetBlock;
        uint8 upgradePossibility = rand();

        if(unicornation == 0) {
            if(upgradePossibility < 80) {
                return true;
            } else {
                return false;
            }
        } else if(unicornation == 1) {
            if(upgradePossibility < 50) {
                return true;
            } else {
                return false;
            }
        } else if(unicornation == 2) {
            if(upgradePossibility < 30) {
                return true;
            } else {
                return false;
            }
        }
    } 
    
}