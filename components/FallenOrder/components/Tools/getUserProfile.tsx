import axios from 'axios'
import { algodIndexer } from 'lib/algodClient'
import { rateLimiter } from 'lib/ratelimiter'
import { formatDuration } from 'utils/formatTimer'

const user_data_wallet = "QBLXBZZ5CVAEJJBO63RQEC43XBWBJHVEO46WHHWR7XJ6YOJHPHUQ3CTSMM"

async function calculateElapsedSeconds(dripTimer: any) {
    if (dripTimer === 0) {
      return 0
    }
    const months: { [key: string]: number } = {
      Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
      Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11
    }
  
    const parts = dripTimer.split(' ')
  
    if (parts.length !== 4) {
      console.error("Invalid drip_timer format")
      return NaN
    }
  
    const month = months[parts[0]]
    const day = parseInt(parts[1])
    const year = parseInt(parts[2])
    const timeParts = parts[3].split(/(\d+):(\d+)([APM]+)$/)
    let hours = parseInt(timeParts[1])
    const minutes = parseInt(timeParts[2])
    const ampm = timeParts[3]
  
    if (ampm === 'PM' && hours < 12) {
      hours += 12
    } else if (ampm === 'AM' && hours === 12) {
      hours = 0
    }
  
    const localDripDate = new Date(year, month, day, hours, minutes)

    const utcOffsetMinutes = localDripDate.getTimezoneOffset()

    const utcDripDate = new Date(localDripDate.getTime() - utcOffsetMinutes * 60 * 1000)

    const currentDate = new Date()

    const elapsedMilliseconds = currentDate.getTime() - utcDripDate.getTime()
    const elapsedSeconds = Math.floor(elapsedMilliseconds / 1000)
    let time_remaining = null
    if (elapsedSeconds <= 21600) {
        time_remaining = formatDuration(21600-elapsedSeconds)
    }

    return time_remaining
  }

export async function getProfile(wallet: string): Promise<any> {
    let allListings = []
    const metadata_api = `https://mainnet-idx.algonode.cloud/v2/accounts/${user_data_wallet}`
    
    try {
        const response = await axios.get(metadata_api)
        
        if (response.status === 200) {
            const data = response.data
            const assets = data.account["created-assets"]
            
            for (const asset of assets) {
                if (asset.params.reserve === wallet) {
                    const asset_id = asset.index
                    const metadata_api = `https://mainnet-idx.algonode.cloud/v2/transactions?tx-type=acfg&asset-id=${asset_id}&address=${user_data_wallet}`
                    
                    try {
                        const response = await axios.get(metadata_api)
                        
                        if (response.status === 200) {
                            const data = response.data
                            const note = data.transactions[0].note
                            const metadata_decoded_asset = JSON.parse(Buffer.from(note, 'base64').toString('utf-8'))
                            const main_character = metadata_decoded_asset.properties["Main Character"] || 0
                            let mainName = null
                            let mainImage = null
                            let mainData = null
                            let bgImage = null
                            let bgName = null

                            if (main_character !== 0) {
                                const charInfo = await algodIndexer.lookupAssetByID(main_character).do()
                                mainName = charInfo.asset.params['unit-name']
                                mainImage = 'https://cloudflare-ipfs.com/ipfs/' + charInfo.asset.params.url.substring(7)
                                const metadata_api = `https://mainnet-idx.algonode.cloud/v2/transactions?tx-type=acfg&asset-id=${main_character}&address=CHARX2GZKNZZORNV2WROPUTSB5QBVRIC62QXXLABFCKA2QALEA3OHVIDYA`
                                try {
                                    const response = await axios.get(metadata_api)
                                    if (response.status === 200) {
                                        mainData = JSON.parse(atob(response.data.transactions[0].note)).properties
                                        const bgID = JSON.parse(atob(response.data.transactions[0].note)).properties["Background"] || null
                                        if (bgID && bgID !== '-') {
                                          const bgInfo = await algodIndexer.lookupAssetByID(bgID).do()
                                          bgImage = 'https://cloudflare-ipfs.com/ipfs/' + bgInfo.asset.params.url.substring(7)
                                          bgName = bgInfo.asset.params['unit-name']
                                        }

                                    }
                                } catch (error: any) {
                                    console.log(error.message)
                                }
                            }
                            
                            const equipped_tool = metadata_decoded_asset.properties["Equipped Tool"] || 0
                            let toolData = null
                            let toolName = null
                            let toolImage = null

                            if (equipped_tool !== 0) {
                                const toolInfo = await algodIndexer.lookupAssetByID(equipped_tool).do()
                                toolName = toolInfo.asset.params['unit-name']
                                toolImage = 'https://cloudflare-ipfs.com/ipfs/' + toolInfo.asset.params.url.substring(7)
                                const metadata_api = `https://mainnet-idx.algonode.cloud/v2/transactions?tx-type=acfg&asset-id=${equipped_tool}&address=GIYNTAUO6M3KGAKHSQBXFUPT3TLFAAQBUYNBHOZUV6UKMTIZ44Z64KI7YM`
                                try {
                                    const response = await axios.get(metadata_api)
                                    if (response.status === 200) {
                                        toolData = JSON.parse(atob(response.data.transactions[0].note)).properties
                                    }
                                } catch (error: any) {
                                    console.log(error.message)
                                }
                            }

                            const kinship_subs = metadata_decoded_asset.properties["Kinship Subs"] || 0
                            const drip_timer = metadata_decoded_asset.properties["Drip Timer"] || 0
                            const total_drip = metadata_decoded_asset.properties["Total Drip"] || 0
                            const boss_battles = metadata_decoded_asset.properties["Boss Battles"] || "0/0"
                            const name = metadata_decoded_asset.properties["Name"] || "-"
                            const image = metadata_decoded_asset.properties["Image"] || "-"
                            const listings = metadata_decoded_asset.properties["Listings"] || null
                            if (listings) {
                                const listingData = listings.split('/').slice(1).map(async (listing: any) => {
                                    const listingID = parseInt(listing.split(',')[0])
                                    const assetID = parseInt(listing.split(',')[1])
                                    const price = listing.split(',')[1]
                                    const expAccepted = parseInt(listing.split(',')[2])
                                    const assetInfo = await algodIndexer.lookupAssetByID(assetID).do()
                                    const assetName = assetInfo.asset.params['unit-name']
                                    const assetImage = 'https://cloudflare-ipfs.com/ipfs/' + assetInfo.asset.params.url.substring(7)
                                    return { wallet, listingID, assetID, price, assetName, assetImage, expAccepted }
                                })
                            
                                const processedListings = await Promise.all(listingData)
                                allListings.push(...processedListings)
                            }
                            const time_remaining = await calculateElapsedSeconds(drip_timer)
                            const user_data = {
                                asset_id,
                                main_character,
                                mainName,
                                mainImage,
                                mainData,
                                bgName,
                                bgImage,
                                metadata_decoded_asset,
                                equipped_tool,
                                toolName,
                                toolImage,
                                toolData,
                                kinship_subs,
                                drip_timer,
                                total_drip,
                                time_remaining,
                                boss_battles,
                                name,
                                image,
                                allListings
                            }
                            return user_data
                        } else {
                            console.log("Error fetching data from API")
                            return null
                        }
                    } catch (error) {
                        console.error("Error fetching data from API:", error)
                        return null
                    }
                }
            }
        } else {
            console.log("Error fetching data from API")
            return null
        }
    } catch (error) {
        console.error("Error fetching data from API:", error)
        return null
    }
    return null
}

export async function getListings(): Promise<any> {
    try {
      const metadata_api = `https://mainnet-idx.algonode.cloud/v2/accounts/${user_data_wallet}`
      const response = await axios.get(metadata_api)
      const data = response.data
      const assets = data.account["created-assets"]
      const batchSize = 100
      let allListings: any = []
  
      const fetchAssetData = async (asset: any) => {
        const metadata_api = `https://mainnet-idx.algonode.cloud/v2/transactions?tx-type=acfg&asset-id=${asset.index}&address=${user_data_wallet}`
        try {
          const response = await rateLimiter(() => axios.get(metadata_api))
          if (response.status === 200) {
            const data = response.data
            const note = data.transactions[0].note
            const metadata_decoded_asset = JSON.parse(Buffer.from(note, 'base64').toString('utf-8'))
            const listings = metadata_decoded_asset.properties["Listings"] || null
  
            if (listings) {
              const listingData = listings.split('/').slice(1).map(async (listing: any) => {                
                const listingID = parseInt(listing.split(',')[0])
                const assetID = parseInt(listing.split(',')[1])
                const price = listing.split(',')[2]
                const expAccepted = parseInt(listing.split(',')[3])
                const assetInfo = await algodIndexer.lookupAssetByID(assetID).do()
                const assetName = assetInfo.asset.params['unit-name']
                const assetImage = 'https://cloudflare-ipfs.com/ipfs/' + assetInfo.asset.params.url.substring(7)
                return { wallet: asset.params.reserve, listingID, assetID, price, assetName, assetImage, expAccepted }
              })
  
              const processedListings = await Promise.all(listingData)
              allListings.push(...processedListings)
            }
          } else {
            console.log("Error fetching data from API")
          }
        } catch (error) {
          console.error("Error fetching data from API:", error)
        }
      }

      await Promise.all(
        assets.map((asset: any, index: any) => {
          if (index % batchSize === 0) {
            return Promise.all(assets.slice(index, index + batchSize).map(fetchAssetData))
          }
          return null
        })
      )
      console.log(allListings)
      return allListings
    } catch (error) {
      console.error("Error fetching listings:", error)
      return null
    }
  }
  
  