import axios from 'axios'

const key = '332337ce3ccc595d53b3'
const secret = "8a1b848c3737a7c58698070068a342c85289c825eff9238fce9ab4c8c89fea75 "

export const pinJSONToIPFS = async json => {
    const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`

    try {
        const res = await axios.post(url, json, {
          headers: {
            pinata_api_key: key,
            pinata_secret_api_key: secret
          }
        })
        return res.data.IpfsHash
    } catch(error) {
        console.log('JSON to IPFS error', error)
    }
}
  
export const pinFileToIPFS = async (file, pinataMetaData) => {
    const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`
  
    let data = new FormData()
  
    data.append('file', file)
    data.append('pinataMetadata', JSON.stringify(pinataMetaData))

    try {
        const res = await axios.post(url, data, {
          maxBodyLength: 'Infinity',
          headers: {
            'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
            pinata_api_key: key,
            pinata_secret_api_key: secret
          }
        })
        return res.data.IpfsHash
    } catch(error) {
        console.log('File to IPFS error', error)
    }
}