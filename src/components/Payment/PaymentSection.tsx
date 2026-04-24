import React, { useState } from 'react';

interface Transaction {
  id: number;
  type: 'deposit' | 'withdraw' | 'transfer';
  amount: number;
  sender?: string;
  receiver?: string;
  status: 'completed' | 'pending' | 'failed';
  date: string;
}

export const PaymentSection: React.FC = () => {
  const [balance, setBalance] = useState(25000);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [paymentType, setPaymentType] = useState<'deposit' | 'withdraw' | 'transfer'>('deposit');
  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: 1,
      type: 'deposit',
      amount: 10000,
      status: 'completed',
      date: '2026-04-20'
    },
    {
      id: 2,
      type: 'transfer',
      amount: 5000,
      sender: 'Michael Rodriguez',
      receiver: 'Sarah Johnson',
      status: 'completed',
      date: '2026-04-19'
    },
    {
      id: 3,
      type: 'withdraw',
      amount: 2000,
      status: 'completed',
      date: '2026-04-18'
    }
  ]);

  const handlePayment = () => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    if (paymentType === 'withdraw' && numAmount > balance) {
      alert('Insufficient balance');
      return;
    }

    const newTransaction: Transaction = {
      id: Date.now(),
      type: paymentType,
      amount: numAmount,
      status: 'completed',
      date: new Date().toISOString().split('T')[0]
    };

    if (paymentType === 'transfer') {
      if (!recipient) {
        alert('Please enter recipient name');
        return;
      }
      newTransaction.sender = 'You';
      newTransaction.receiver = recipient;
    }

    if (paymentType === 'deposit') {
      setBalance(balance + numAmount);
    } else if (paymentType === 'withdraw') {
      setBalance(balance - numAmount);
    } else if (paymentType === 'transfer') {
      setBalance(balance - numAmount);
    }

    setTransactions([newTransaction, ...transactions]);
    setAmount('');
    setRecipient('');
    setShowPaymentForm(false);
    alert(`${paymentType.toUpperCase()} of $${numAmount} successful!`);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'deposit': return '#10B981';
      case 'withdraw': return '#EF4444';
      case 'transfer': return '#F59E0B';
      default: return '#6B7280';
    }
  };

  return (
    <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', marginTop: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
      <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '20px' }}>💰 Payment & Wallet</h2>

      {/* Wallet Balance Card */}
      <div style={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
        borderRadius: '16px', 
        padding: '24px', 
        marginBottom: '24px',
        color: 'white'
      }}>
        <p style={{ fontSize: '14px', opacity: 0.9, marginBottom: '8px' }}>Total Balance</p>
        <h1 style={{ fontSize: '36px', fontWeight: 'bold', marginBottom: '4px' }}>${balance.toLocaleString()}</h1>
        <p style={{ fontSize: '12px', opacity: 0.8 }}>Available for investment and withdrawals</p>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <button
          onClick={() => { setPaymentType('deposit'); setShowPaymentForm(true); }}
          style={{ backgroundColor: '#10B981', color: 'white', padding: '10px 20px', borderRadius: '8px', border: 'none', cursor: 'pointer', flex: 1, fontWeight: 'bold' }}
        >
          + Deposit
        </button>
        <button
          onClick={() => { setPaymentType('withdraw'); setShowPaymentForm(true); }}
          style={{ backgroundColor: '#EF4444', color: 'white', padding: '10px 20px', borderRadius: '8px', border: 'none', cursor: 'pointer', flex: 1, fontWeight: 'bold' }}
        >
          - Withdraw
        </button>
        <button
          onClick={() => { setPaymentType('transfer'); setShowPaymentForm(true); }}
          style={{ backgroundColor: '#F59E0B', color: 'white', padding: '10px 20px', borderRadius: '8px', border: 'none', cursor: 'pointer', flex: 1, fontWeight: 'bold' }}
        >
          ↪ Transfer
        </button>
      </div>

      {/* Payment Form Modal */}
      {showPaymentForm && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', width: '400px', maxWidth: '90%' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px' }}>
              {paymentType === 'deposit' && 'Deposit Funds'}
              {paymentType === 'withdraw' && 'Withdraw Funds'}
              {paymentType === 'transfer' && 'Send Money'}
            </h3>
            
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Amount ($)</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #D1D5DB' }}
              />
            </div>

            {paymentType === 'transfer' && (
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Recipient</label>
                <input
                  type="text"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  placeholder="Enter recipient name"
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #D1D5DB' }}
                />
              </div>
            )}

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowPaymentForm(false)}
                style={{ padding: '10px 20px', borderRadius: '8px', border: '1px solid #D1D5DB', backgroundColor: 'white', cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
                onClick={handlePayment}
                style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', backgroundColor: '#4F46E5', color: 'white', cursor: 'pointer' }}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Transaction History */}
      <div>
        <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '16px' }}>📜 Transaction History</h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #E5E7EB' }}>
                <th style={{ textAlign: 'left', padding: '12px' }}>Date</th>
                <th style={{ textAlign: 'left', padding: '12px' }}>Type</th>
                <th style={{ textAlign: 'left', padding: '12px' }}>Details</th>
                <th style={{ textAlign: 'right', padding: '12px' }}>Amount</th>
                <th style={{ textAlign: 'center', padding: '12px' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <tr key={tx.id} style={{ borderBottom: '1px solid #F3F4F6' }}>
                  <td style={{ padding: '12px', fontSize: '14px' }}>{tx.date}</td>
                  <td style={{ padding: '12px' }}>
                    <span style={{ 
                      backgroundColor: getTypeColor(tx.type), 
                      color: 'white', 
                      padding: '4px 8px', 
                      borderRadius: '12px', 
                      fontSize: '12px',
                      display: 'inline-block'
                    }}>
                      {tx.type.toUpperCase()}
                    </span>
                  </td>
                  <td style={{ padding: '12px', fontSize: '14px' }}>
                    {tx.type === 'transfer' ? `${tx.sender} → ${tx.receiver}` : '-'}
                  </td>
                  <td style={{ padding: '12px', textAlign: 'right', fontWeight: 'bold' }}>
                    {tx.type === 'deposit' ? '+' : '-'}${tx.amount.toLocaleString()}
                  </td>
                  <td style={{ padding: '12px', textAlign: 'center' }}>
                    <span style={{ color: '#10B981', fontSize: '12px' }}>✓ {tx.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};