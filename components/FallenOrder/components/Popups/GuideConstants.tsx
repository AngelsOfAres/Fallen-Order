import { Text, VStack, Link, Menu, MenuButton, Icon, Button } from '@chakra-ui/react'
import { useColorModeValue, useBreakpointValue } from '@chakra-ui/react'
import { FullGlowButton, IconGlowButton } from 'components/Buttons'
import { BsShop } from 'react-icons/bs'

export const WelcomeBox = ({ index }: any) => {
    const buttonText3 = useColorModeValue('orange.500', 'cyan.500')
    const buttonText4 = useColorModeValue('orange.200', 'cyan.100')
    const xLightColor = useColorModeValue('orange.100', 'cyan.100')
    const mLightColor = useColorModeValue('orange.200', 'cyan.200')
    const medColor = useColorModeValue('orange.500', 'cyan.500')
    const LightColor = useColorModeValue('orange.300', 'cyan.300')
    const buttonText5 = useColorModeValue('orange', 'cyan')
    const fontSize1 = useBreakpointValue({ base: '10px', sm: '11px', md: '12px', lg: '13px', xl: '14px' })

    const getBoxByIndex = (index: any) => {
        switch (index) {
            //1: ['Welcome', ''],
            // 2: ['$ORDER', ''],
            // 3: ['$EXP', ''],
            // 4: ['Grand Exchange', ''],
            // 5: ['Kinship', ''],
            // 6: ['Battles', ''],
            // 7: ['Trading', ''],
            // 8: ['Skills', ''],
            // 9: ['Tribute Of Fortune', ''],
            // 10: ['Casino', ''],
            // 11: ['Lottery', ''],
            // 12: ['Fusion', ''],
            // 13: ['Absorb', ''],
            // 14: ['Gear', ''],
            // 15: ['Upgrades', ''],
            // 16: ['Quests', ''],
            // 17: ['Leveling', '']
            
            case 1: // Welcome Box
                return (
                    <>
                        <VStack mb={4} spacing='12px'>
                            <Text fontSize={fontSize1} textAlign='center' textColor={xLightColor}>The Order is honored by your presence. Your first step towards glory beings here.</Text>
                            <Link href='https://algoxnft.com/shuffle/2467'><FullGlowButton fontsize='10px' text='JOIN THE ORDER!' /></Link>
                        </VStack>
                        <Text fontSize={fontSize1} textAlign='center' textColor={xLightColor}>
                            If you are a new player, please head over to the My FO page and click the Initiate button at the top of the screen.
                            <br /><br />
                            Once you have Initiated your account, you may proceed to utilize all features within The Order.
                            <br /><br />
                            As an MMORPG, there is a wide variety of functionality for you to enjoy, check the menu at the top of this guide to explore further!
                            <br /><br />
                        </Text>
                    </>
                )
            
            case 2: // $ORDER Token
                return (
                    <>
                        <Text fontSize={fontSize1} textAlign='center' textColor={xLightColor}>
                            $ORDER is one of the main in-game tokens used aross the ecosystem.
                            <br /><br />
                            It is deposited into your account at a rate of 1 token per character per day.
                            <br /><br />
                            $ORDER is considered the Time currency within The Order. It is semi-soulbound by nature and can not be traded or transferred manually. There are many features where $ORDER may be either used or converted into other currencies.
                            <br /><br />
                            It also acts as a governance token. Players will have voting power weighted based on $ORDER holdings, to govern a treasury and guide the direction of their respective Faction.
                            <br /><br />
                            You may utilize your tokens to advance within The Order. Uses include Leveling, Crafting, Fusion, and more.
                            <br /><br />
                            You may swap $ORDER tokens into $EXP tokens directly on this platform. Click your $EXP balance on My FO page or GE to access the direct swap.
                            <br /><br />
                        </Text>
                    </>
                )

            case 3: // $EXP Token
                return (
                    <>
                    <Text fontSize={fontSize1} textAlign='center' textColor={xLightColor}>
                        $EXP is one of the main in-game tokens used aross the ecosystem.
                        <br /><br />
                        It is deposited daily into your account at a variable rate based on your characters&apos; ranks.
                        <br />
                        <Text textColor={buttonText5}>R1-3 | R2-5 | R3-8 | R4-12 | R5-25</Text>
                        <br />
                        $EXP is considered the Money currency within The Order. It is fully free to manually manage, may be used within the game, or traded into other currencies via liquidity pools.
                        <br /><br />
                        The price remains semi-curved to 0.01 $ALGO. This makes liquidity providers receive near-zero impermanent loss for adding their tokens to the liquidity pool.
                        <br /><br />
                        Essentially, an investor&apos;s oasis. If you hold any $EXP tokens that you do not intend to utilize or trade, it is most beneficial to add them to the liquidity pool to take advantage of the fee earnings given no risk of impermanent losses.
                        <br /><br />
                        <a href='https://app.tinyman.org/#/pool/GVO4WI2OXKF7TXJH23DLME6FDBBKBIEXXSDY64K72R42LJZU5LFQ2PQ7W4/add-liquidity' target='_blank' rel='noreferrer'>
                            <FullGlowButton fontsize='10px' text='ADD TO POOL!' />
                        </a>
                        <br /><br />
                        $EXP is used extensively within the game. Uses include payments, rewards, subscriptions, microfees, and trading.
                        <br /><br />
                        You may swap $EXP tokens directly on this platform. Click your $EXP balance on My FO page or GE to access the direct swap.
                        <br /><br />
                    </Text>
                    </>
                )

            case 4: // Grand Exchange
                return (
                    <>
                        <Text fontSize={fontSize1} textAlign='center' textColor={xLightColor}>
                            The GE is our native marketplace. It has a few unique features.
                            <br /><br />
                            1. You may list any in-game items on the marketplace. The asset will remain in your account, playable, receive daily rewards, and able to be fully utilized within the game.
                            <br /><br />
                            2. You have the option of accepting $EXP in addition to the default accepted $ALGO as a currency of payment.
                            <br /><br />
                            3. If you list an item for X $ALGO, you will receive X $ALGO upon sale. We delegate the fees and optional royalties to the buyer. No worrying about doing any math, simply list for what you want to receive.
                            <br /><br />
                            The Grand Exchange is your go to place to find or trade in-game items. No third party apps required.
                            <br /><br />
                            <Link href='/ge'>
                                <IconGlowButton icon={BsShop} />
                            </Link>
                            <br /><br />
                        </Text>
                    </>
                )

            case 5: // Kinship
                return (
                    <>
                        <Text fontSize={fontSize1} textAlign='center' textColor={xLightColor}>
                            This is a trait on each character. It describes the relationship between Master and Character.
                            <br /><br />
                            It is gained by casting a daily ritual with your character, increasing its Kinship by +1.
                            <br /><br />
                            Kinship can not be gained in any other way primarily. However, it can be Absorbed into Potions and traded between characters or other players.
                            <br /><br />
                            There are 100 total Kinship Potions. They may be crafted until supply runs out. No more Kinship Potions will be made at least not for a long time, only if user base grows past thresholds and more supply is required.
                            <br /><br />
                            You may opt to subscribe to Auto-Kinship at a cost of 5 $EXP per character per day. We will handle all of your characters&apos; Kinship daily. This guarantees you never miss a second on Kinship farming. Manual casting will always lead to a loss in seconds, minutes, or hours, which overtime accumulate to alot of lost Kinship.
                            <br /><br />
                            To subscribe, go to your profile on My FO page and click on Kinship Subs (+).
                            <br /><br />
                        </Text>
                    </>
                )

            case 6: // Battles
                return (
                    <>
                        <Text fontSize={fontSize1} textAlign='center' textColor={xLightColor}>
                            Take your character into the Thunderdome and battle bosses for glory!
                            <br /><br />
                            There are 3 bosses available to battle, each at a higher level than the previous and rewarding varying Points, which count towards your Weekly and All Time leaderboard rankings.
                            <br /><br />
                            Points yield rewards based on your ranking from the weekly leaderboard. Minimum to qualify is 5 Points weekly.
                            <br /><br />
                            Rewards are as follows, in $EXP:
                            <br /><br />
                            1st - 2500 | 2nd - 1250 | 3rd - 750 | 4/6th - 500 | 7/10th - 250
                            <br /><br />
                            Every participant past the Top 10 receives 50 $EXP.
                            <br /><br />
                            In order to battle, head over to My FO page first and set your characters&apos; stats, abilities, and select your main character. You will then be able to use the /battle command in Discord.
                            <br /><br />
                            Battles are real-time, turn by turn, stat and ability based. They present a challenge and are interactive.
                            <br /><br />
                            In addition to our main 3 bosses, we have 6 collab bosses with varying rewards from other brands within the greater community. Play and earn rewards on the spot.
                            <br /><br />
                        </Text>
                    </>
                )
            
            case 7: // Trading
                return (
                    <>
                        <Text fontSize={fontSize1} textAlign='center' textColor={xLightColor}>
                            You may trade all in-game items by utlizing built-in functionality within the ecosystem.
                            <br /><br />
                            Trade offers may be posted in the #p2p-trading channel in Discord. Send any item via /send command for a seamless transfer.
                            <br /><br />
                            Given the nature of our items, we have intrinsic security and your assets can be retrieved if any malicious actor attempts to scam you.
                            <br /><br />
                            This will be migrated to a new system on our website, which ensures you do not transfer an item to another player for a trade unless the item you requested is transferred to you at the same time.
                            <br /><br />
                            In additon to trading items via Discord, they may also be traded freely on the Grand Exchange, elsewhere on third party apps/marketplaces, or manually traded via OTC.
                            <br /><br />
                            To trade $EXP, you may use our direct swap tool by clicking on your balance on the My FO or GE sections of this platform, as well as via liquidity pools on any exchange.
                            <br /><br />
                        </Text>
                    </>
                )

            case 8: // Skills
                return (
                    <>
                        <Text fontSize={fontSize1} textAlign='center' textColor={xLightColor}>
                            Each character has career traits which are upgradable via gaining experience in The Wilderness.
                            <br /><br />
                            Current available Basic Skills:
                            <br />
                            Woodcutting | Mining
                            <br /><br />
                            Skills may be advanced by equipping a tool. Tools may be crafted, are limited in supply, and have durability. Each tool begins with 100 Uses. Uses may be replenished at any time via $EXP.
                            <br /><br />
                            Let&apos;s take woodcutting for example, where you would use a Hatchet to chop trees:
                            <br /><br />
                            Chopping a tree yields Woodcutting Experience, and successful chops yield Logs. Once woodcutting experience reaches the threshold for the next level up, it will autolevel your character&apos;s Woodcutting Level.
                            <br /><br />
                            There are random $EXP drops that occur while grinding your skills, available for anyone around to claim, fastest gets it.
                            <br /><br />
                            Moreover, each tree/rock has a chance at containing a Rich Vein, which yields $EXP on the spot as a reward.
                            <br /><br />
                            Materials, such as logs and ore, are uses heavily within the ecosystem. Examples include leveling, tributes, crafting, absorb, fusion, etc.
                            <br /><br />
                            They are freely traded and are both a provider to the economy by the player, as well as a source of revenue to the player choosing to play it as a career.
                            <br /><br />
                            Get yourself a tool, equip it, and get to grinding your Skills!
                            <br /><br />
                        </Text>
                    </>
                )

            case 9: // Tribute Of Fortune
                return (
                    <>
                        <Text fontSize={fontSize1} textAlign='center' textColor={xLightColor}>
                            This is the lootbox mechanism. Sacrifice 5 materials, either logs or ore currently, to open a lootbox. Rewards include characters, tokens, tools, gear, $ALGO, kinship subs, potions, and more. Full breakdown with drop rates below.
                            <br /><br />
                            <a href="https://i.ibb.co/r4sf0kx/image.png" target='_blank' rel='noreferrer'>
                                <FullGlowButton text="View Loot" />
                            </a>
                            <br /><br />
                            Materials may be obtained by grinding skills, or traded for with other players who have a skill for a career.
                            <br /><br />
                            This system is open to the public. Simply get 5 of any material and you have the ability to make a sacrifice.
                            <br /><br />
                            The Order awaits your sacrifice...they may reward you heavily for your efforts, or not at all!
                            <br /><br />
                        </Text>
                    </>
                )

            case 10: // Casino
                return (
                    <>
                        <Text fontSize={fontSize1} textAlign='center' textColor={xLightColor}>
                            There are 3 minigames available within the Discord server:
                            <br />
                            Dice | Blackjack | Slots
                            <br /><br />
                            Casino games are played with $EXP tokens. Rewards are handled on the spot, no waiting no cashiers no swaps.
                            <br /><br />
                            Head over to the server and get your inner degen on!
                        </Text>
                    </>
                )

            case 11: // Lottery
                return (
                    <>
                        <Text fontSize={fontSize1} textAlign='center' textColor={xLightColor}>
                            Daily lottery open to the public. Entries via Discord server. Draw daily at 12:00PM EST.
                            <br /><br />
                            Current Available Pools:
                            <br />
                            $EXP | $ALGO
                            <br /><br />
                            Pool Distributions:
                            <br />
                            90% Winner | 4% AoA Vault | 3% Random FO Player | 3% Next Pool
                            <br /><br />
                            Feeling lucky? Hop in the pools and try them out!
                        </Text>
                    </>
                )

            case 12: // Fusion
                return (
                    <>
                        <Text fontSize={fontSize1} textAlign='center' textColor={xLightColor}>
                            Fuse 2 lower rank characters into a Rank +1 character.
                            <br /><br />
                            Kinship will be 100% transferred to the fused character.
                            <br /><br />
                            Level, Points, Woodcutting Level/EXP will be totaled and 50% (rounded up) will be transferred to the fused character.
                            <br /><br />
                            Example:
                            <br /><br />
                            Character 1: Rank 1, Level 1, 1050 Points, 19 Kinship, WC Exp 2500
                            <br /><br />
                            Character 2: Rank 1, Level 2, 1100 Points, 32 Kinship, WC Exp 100
                            <br /><br />
                            New Fused Rank 2 Celestial:
                            <br />
                            Level 3/2 = 2.5 = 3
                            <br />
                            Points 2150/2 = 1075
                            <br />
                            Kinship 51/2 = 25.5 = 26
                            <br />
                            WC 2600/2 = 1300
                            <br /><br />
                            Available Fusion Supply:
                            <br /><br />
                            R2 - 108 | R3 - 36 | R4 - 8
                            <br /><br />
                            Cost Breakdown:
                            <br /><br />
                            2 Rank 3 Ethereals 🔀 Rank 4 Empyreal:
                            <br />
                            1,000 $ORDER + 50,000 $EXP + 300 Oak Logs + 300 Clay Ore
                            <br /><br />
                            2 Rank 2 Celestials 🔀 Rank 3 Ethereal:
                            <br />
                            500 $ORDER + 20,000 $EXP + 125 Oak Logs + 125 Clay Ore
                            <br /><br />
                            2 Rank 1 Angels 🔀 Rank 2 Celestial:
                            <br />
                            100 $ORDER + 5,000 $EXP + 50 Oak Logs + 50 Clay Ore
                            <br /><br />
                        </Text>
                    </>
                )

            case 13: // Absorb
                return (
                    <>
                        <Text fontSize={fontSize1} textAlign='center' textColor={xLightColor}>
                            Some character traits have a mechanism to Absorb them into Potions.
                            <br /><br />
                            These include Skill Experience, Leveling Wisdom, and Kinship.
                            <br /><br />
                            Skill, Wisdom, and Kinship Potions are craftable while supplies last. Total supply of each type is 100. The cost to craft a Potion is 10 $ORDER + 1500 $EXP + 10 Oak Logs + 10 Clay Ore.
                            <br /><br />
                            Potions may be reused and have no storage limitations. You may store infinite of each type in its corresponding potion.
                            <br /><br />
                            The cost to Asborb any trait from a character is 25 $EXP + 1 Oak Log + 1 Clay Ore. The cost to use a Potion on a character is 25 $EXP.
                            <br /><br />
                            Kinship is Absorbed at a 50% rate (rounded up). Level Wisdom and Skill Experience are Absorbed at 100% rate with no loss.
                            <br /><br />
                        </Text>
                    </>
                )
            
            case 14: // Equipment/Gear
                return (
                    <>
                        <Text fontSize={fontSize1} textAlign='center' textColor={xLightColor}>
                            Characters are all originally unequipped with gear.
                            <br /><br />
                            You may equip gear on to your character, and change its appearance/stats at any time.
                            <br /><br />
                            Gear includes backgrounds, weapons, headwear, eyewear, mouthwear, clothing, and a minion.
                            <br /><br />
                            Backgrounds are currently available in Ranks 1 to 3. The remaining Ranks 4 and 5 are in the art development process at the moment.
                            <br /><br />
                            You may craft a background of any available rank and you will receive a randomly chosen background of that tier.
                            <br /><br />
                            Crafting Cost:
                            <br /><br />
                            R1 - 100 $EXP + 5 Oak Logs + 5 Clay Ore
                            <br /><br />
                            R2 - 250 $EXP + 10 Oak Logs + 10 Clay Ore
                            <br /><br />
                            R3 - 1250 $EXP + 20 Oak Logs + 20 Clay Ore
                            <br /><br />
                            Head over to Discord and use /craft-background command to get started!
                            <br /><br />
                        </Text>
                    </>
                )
            
            case 15: // Upgrades
                return (
                    <>
                        <Text fontSize={fontSize1} textAlign='center' textColor={xLightColor}>
                            Your character has various upgrades that can be tuned to the player&apos;s needs.
                            <br /><br />
                            These include Level, Kinship, Stats, Abilities, Gear, and Skills.
                            <br /><br />
                            Various actions within the game rewards your character with Level Wisdom, which enable Leveling Up upon reaching the threshold for required Wisdom for the next Level.
                            <br /><br />
                            Kinship can be gained daily by interacting with your character via casting a ritual.
                            <br /><br />
                            Stats consists of ATK, DEF, AP, HP, and Total Points. Total Points start at 1000 for every character, and are allocated towards the 3 battle stats, Attack, Defense, and HP.
                            <br /><br />
                            Upon leveling up your character, you will receive 1 $BOOST. This may be used to permanently add +50 Points to any character or may be freely traded on the market.
                            <br /><br />
                            HP is gained with Levels. LVL 0 characters begin at 10000 HP and gain +500 HP permanently for every Level advanced.
                            <br /><br />
                            Abilities consist of 3 Basic and 1 Ultimate. There is a 1-turn CD on Basics and a 5-turn cooldown on Ultimates. Use /abilities in Discord to view the current list.
                            <br /><br />
                            Gear may be equipped on to characters and dynamically changed at any time. Each piece of gear has a specific effect on boosting stats.
                            <br /><br />
                            Skills may be advanced by utilizing a tool and grinding in The Wilderness. Currently available Skills are Woodcutting and Mining. We plan to introduce a wide array of Skills, both Basic and Advanced.
                            <br /><br />
                        </Text>
                    </>
                )

            case 16: // Quests
                return (
                    <>
                        <Text fontSize={fontSize1} textAlign='center' textColor={xLightColor}>
                            Complete various Quests to earn achievements and one-time rewards!
                            <br /><br />
                            Adeona awaits you in Discord to begin your journey. Use /quest to begin.
                            <br /><br />
                            Available Quests:
                            <br /><br />
                            Ramsay&apos;s Rampage | The Summoning | I&apos;m A Lumberjack!
                            <br /><br />
                            Each Quest has a set of prerequisites to enable access. Details on each are given upon starting the Quest.
                            <br /><br />
                            Achievements are time-based so the sooner you complete your quests, the earlier you are in the leaderboard of Quest Achievements! OG status is a flex.
                            <br /><br />
                            Rewards for quests vary and may include $EXP, $BOOST, Tools, Gear, Characters, or others.
                            <br /><br />
                        </Text>
                    </>
                )

            case 17: // Leveling
                return (
                    <>
                        <Text fontSize={fontSize1} textAlign='center' textColor={xLightColor}>
                            Each character has a Level trait in the following form:
                            <br />
                            X | Y
                            <br /><br />
                            The X is Level and Y is Wisdom.
                            <br /><br />
                            In order to Level Up to the next level, your character will need to first reach the required threshold of Wisdom required.
                            <br /><br />
                            Wisdom Required Per Level:
                            <br /><br />
                            20750, 64250, 133250, 230250, 358250, 520750,
                            721000, 963250, 1251750, 1591250, 1986750, 2443750,
                            2968000, 3565500, 4244750, 5011750, 5874250, 6841250,
                            7923750, 9134000, 10486250, 11993250, 13671000, 15537500,
                            17616500, 19918000, 22482000, 25333250, 28592500, 32089250...
                            <br /><br />
                            Once your character reaches the required Wisdom you may Level Up via My FO page. Your character will have an indicator to let you know it is ready to level up.
                            <br /><br />
                            Level Up Costs:
                            <br /><br />
                            Oak Logs - 5, 10, 15, 20, 25...
                            <br />
                            Clay Ore - 5, 10, 15, 20, 25...
                            <br />
                            $EXP - 1000, 2000, 3000, 4000, 5000...
                            <br /><br />
                            Character can NOT exceed the max cap of Wisdom required per level, and will receive no further Wisdom until they Level Up to access the next Wisdom cap.
                            <br /><br />
                            Every Level Up grants 1 free $BOOST. You may use it, trade it, or keep it for future use. Additionally, +500 HP is added permanently to your character.
                            <br /><br />
                            Most actions in the game yield Wisdom in varying degrees. Below is the current available Wisdom yielding features:
                            <br /><br />
                            Boss Battles (Loss | Win):
                            <br />
                            Collab 250 | 500
                            <br />
                            Azazel 350 | 700
                            <br />
                            Mordekai 400 | 800
                            <br />
                            Gorgax 450 | 900
                            <br /><br />
                            Quests:
                            <br />
                            General Quest 1 - 2500
                            <br />
                            General Quest 2 - 5000
                            <br />
                            WC Quest - 2000
                            <br /><br />
                            Woodcutting | Mining:
                            <br />
                            100 Fail | 200 Success
                            <br /><br />
                            Kinship:
                            <br />
                            1000 per Character Level
                            <br /><br />
                        </Text>
                    </>
                )

            default:
                return null
        }
    }

    return getBoxByIndex(index)
}
