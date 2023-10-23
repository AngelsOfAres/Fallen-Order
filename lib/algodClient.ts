import algosdk from 'algosdk'
import { NODE_PORT, NODE_TOKEN, NODE_URL, INDEXER_URL } from 'constants/env'

export const algodClient = new algosdk.Algodv2(NODE_TOKEN, NODE_URL, NODE_PORT)
export const algodIndexer = new algosdk.Indexer(NODE_TOKEN, INDEXER_URL, NODE_PORT)
