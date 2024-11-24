export default async function getNFD(address: string) {
    const apiUrl = `https://api.nf.domains/nfd/lookup?address=${address}&view=full&allowUnverified=false`

    try {
        const response = await fetch(apiUrl)

        if (!response.ok) {
            return null
        }

        const data = await response.json()

        if (data && data[address] && data[address].name) {
            return data[address].name
        } else {
            return null
        }
    } catch (error) {
        return null
    }
}