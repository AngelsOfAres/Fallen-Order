import { Box, useColorModeValue, Text, Select, VStack } from '@chakra-ui/react'
import * as React from 'react'
import { useEffect, useState, useMemo } from 'react'
import styles from '../../../../styles/glow.module.css'
import { WelcomeBox } from './GuideConstants'

export default function GuideBoxPopup() {
    const [chosenOption, setChosenOption] = useState<any>(1)
    const [selectedOptionText, setSelectedOptionText] = useState<string>('')
    const buttonText3 = useColorModeValue('orange.500', 'cyan.500')
    const buttonText4 = useColorModeValue('orange.200', 'cyan.100')
    const xLightColor = useColorModeValue('orange.100', 'cyan.100')
    const mLightColor = useColorModeValue('orange.200', 'cyan.200')
    const medColor = useColorModeValue('orange.500', 'cyan.500')
    const LightColor = useColorModeValue('orange.300', 'cyan.300')
    const buttonText5 = useColorModeValue('orange', 'cyan')
    const gradientText = useColorModeValue(styles.textAnimatedGlowL, styles.textAnimatedGlowD)
    const boxGlow = useColorModeValue(styles.boxGlowL, styles.boxGlowD)

    const guideOptions: any = useMemo(() => ({
        1: ['Welcome!', <WelcomeBox key={1} index={1} />],
        2: ['$ORDER', <WelcomeBox key={2} index={2} />],
        3: ['$EXP', <WelcomeBox key={3} index={3} />],
        4: ['Grand Exchange', <WelcomeBox key={4} index={4} />],
        5: ['Kinship', <WelcomeBox key={5} index={5} />],
        6: ['Battles', <WelcomeBox key={6} index={6} />],
        7: ['Trading', <WelcomeBox key={7} index={7} />],
        8: ['Skills', <WelcomeBox key={8} index={8} />],
        9: ['Tribute Of Fortune', <WelcomeBox key={9} index={9} />],
        10: ['Casino', <WelcomeBox key={10} index={10} />],
        11: ['Lottery', <WelcomeBox key={11} index={11} />],
        12: ['Fusion', <WelcomeBox key={12} index={12} />],
        13: ['Absorb', <WelcomeBox key={13} index={13} />],
        14: ['Gear', <WelcomeBox key={14} index={14} />],
        15: ['Upgrades', <WelcomeBox key={15} index={15} />],
        16: ['Quests', <WelcomeBox key={16} index={16} />],
        17: ['Leveling', <WelcomeBox key={17} index={17} />]
    }), [])

    useEffect(() => {
        setSelectedOptionText(guideOptions[chosenOption][1])
    }, [chosenOption, guideOptions])

    return (
        <>
            <Box zIndex={999} pb={4} px={1} maxH='400px' h='75vh' w='100%' justifyContent='center' overflow='scroll'
                css={`
                    ::-webkit-scrollbar {
                        display: none;
                    }
                `}
            >
                <VStack>
                    <Text mb='-6px' fontSize='24px' textAlign='center' className={gradientText}>Fallen Guide</Text>
                    <Select
                        w='75%'
                        h='36px'
                        fontSize='14px'
                        style={{ paddingBottom: '8px'}}
                        textAlign='center'
                        iconColor={LightColor}
                        textColor={xLightColor}
                        cursor='pointer'
                        _hover={{ borderColor: medColor }}
                        borderColor={LightColor}
                        borderWidth='1px'
                        borderRadius='12px'
                        onChange={(e) => setChosenOption(parseInt(e.target.value))}
                        placeholder={guideOptions[0]}
                    >
                        {Object.entries(guideOptions).map(([key, value]: any) => (
                            <option style={{ backgroundColor: 'black', fontSize: '12px' }} key={key} value={key}>
                                {value[0]}
                            </option>
                        ))}
                    </Select>
                    {selectedOptionText && (
                        <Box px={4} mt={3} w="100%">
                            {selectedOptionText}
                        </Box>
                    )}
                </VStack>
            </Box>
        </>
    )
}
