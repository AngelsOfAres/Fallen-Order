import React, { useState } from 'react'
import { FullGlowButton } from './Buttons'
import { Center, Table, TableContainer, Tbody, Td, Text, Th, Thead, Tr } from '@chakra-ui/react'
import styles from "../styles/text.module.css"
import NfdLookup from './NfdLookup';

interface Transaction {
    id: string;
    amount: number;
  }

interface TransactionListProps {
    transactions: Transaction[];
  }

const TransactionList: React.FC<TransactionListProps>  = ({ transactions }) => {
    console.log(transactions)
    const removeExtraLineBreaks = (text: any) => {
        return text.replace(/\n{2,}/g, '\n')
      };
    const handleNote = (note: any) => {
    if (!note || typeof note !== 'string') {
        return '-';
    }
    const cleanedNote = atob(note);
    return cleanedNote;
    };
  return (
    <Center my='12px'>
    <TableContainer>
      <Table className="custom-table">
        <Thead className={styles.sText}>
          <Tr>
            <Th textAlign="center" className="column-header">Txn ID</Th>
            <Th textAlign="center" className="column-header">ASA</Th>
            <Th textAlign="center" className="column-header">Amount</Th>
            <Th textAlign="center" className="column-header">Note</Th>
          </Tr>
        </Thead>
        <Tbody className='text-orange-100'>
          {transactions.map((transaction: any, index: any) => (
            <Tr key={index} className={styles.tableText}>
              <Td textAlign="center"  className="column-cell">
                <a
                  href={`https://algoexplorer.io/tx/${transaction.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {transaction.id.substring(0, 5) + "..." + transaction.id.substring(transaction.id.length - 5)}
                </a>
              </Td>
              <Td textAlign="center" className="column-cell">{transaction['payment-transaction']
                    ? 'ALGO'
                    : transaction['asset-transfer-transaction']['asset-id']
                }
            </Td>
              <Td textAlign="center" className="column-cell">{transaction['payment-transaction']
                    ? (transaction['payment-transaction']['amount']/1000000).toFixed(3)
                    : transaction['asset-transfer-transaction']['amount']
                }</Td>
              <Td textAlign="center"  className="column-cell">
                <Text whiteSpace="pre-wrap">{removeExtraLineBreaks(handleNote(transaction.note))}</Text>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
      </TableContainer>
    </Center>
  );
};

async function fetchTxns(wallet1: any, wallet2: any, limit: number = 100, nextToken?: string): Promise<{ transactions: Transaction[], nextToken?: string }> {
    const transactionsUrl = `https://mainnet-idx.algonode.cloud/v2/accounts/${wallet1}/transactions?limit=${limit}&next=${nextToken || ''}`;
  
    try {
      const response = await fetch(transactionsUrl);
      if (!response.ok) {
        throw new Error('Failed to fetch transactions');
      }
      const data = await response.json();
      const transactionsFromWallet1ToWallet2 = data['transactions'].filter((transaction: any) => {
        const assetTransfer = transaction['asset-transfer-transaction'] || transaction['payment-transaction'];
        if (!assetTransfer) {
          return false;
        }
        const sender = transaction['sender']
        const receiver = assetTransfer['receiver']
        const matchCondition =
          (sender === wallet1 && receiver === wallet2) ||
          (sender === wallet2 && receiver === wallet1);
        return matchCondition;
      });
  
      const result: { transactions: Transaction[], nextToken?: string } = {
        transactions: transactionsFromWallet1ToWallet2,
      };
  
      if (data['next-token']) {
        result.nextToken = data['next-token'];
      }
      console.log(result)
      return result;
    } catch (error) {
      console.error('Error fetching and filtering transactions:', error);
      throw error;
    }
  }
  

const WalletTransactionSearch = () => {
  const [wallet1, setWallet1] = useState('');
  const [wallet2, setWallet2] = useState('');
  const [fetchedTransactions, setFetchedTransactions] = useState<Transaction[]>([]);
  const [receiver, setReceiver] = useState<string>('')

  const handleSearch = async () => {
    try {
      const transactionLimit = 10000
      let nextToken: string | undefined;
      const allTransactions: Transaction[] = [];
  
      while (allTransactions.length < transactionLimit) {
        const { transactions, nextToken: newNextToken } = await fetchTxns(wallet1, wallet2, transactionLimit - allTransactions.length, nextToken);
        allTransactions.push(...transactions);
  
        if (!newNextToken) {
          break;
        }
  
        nextToken = newNextToken;
      }
  
      setFetchedTransactions(allTransactions);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };
  

  return (
    <div className='mt-6'>
      <h1 className={styles.hText}>Wallet-2-Wallet Search</h1>
      <div className="flex flex-col items-center justify-center">
      <NfdLookup
        className="relative w-80 my-2 cursor-default rounded-md border border-black bg-orange-100 text-center shadow-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 sm:text-sm"
        value={wallet1}
        onChange={(value) => setWallet1(value)}
        placeholder={"Enter Address/NFD 1"}
        ariaDescribedby="lookup-description"
        />
        <NfdLookup
        className="relative w-80 my-2 cursor-default rounded-md border border-black bg-orange-100 text-center shadow-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 sm:text-sm"
        value={wallet2}
        onChange={(value) => setWallet2(value)}
        placeholder={"Enter Address/NFD 2"}
        ariaDescribedby="lookup-description"
        />
        <Center m={4}><FullGlowButton fontsize='16px' text='Search' onClick={handleSearch} /></Center>
      </div>
      {fetchedTransactions.length > 0? 
      <TransactionList transactions={fetchedTransactions} /> : null}
    </div>
  );
};

export default WalletTransactionSearch;
