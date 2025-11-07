/**
 * employeeController.js
 * 
 * This file handles the methods that allow employees to view transactions, verify and submit.
 * 
 * Reference:
 * OpenAI, 2025. ChatGPT [Computer program]. Version GPT-5 mini. 
 * Available at: https://chat.openai.com
 */

import Transaction from "../models/Transaction.js";

//Method to fetch all pending and verified transactions seperately
export const getAllTransactions = async (req, res) => {
    try{
        const pendingTransactions = await Transaction.find({status: "Pending"}).sort({createdAt: -1});
        const verifiedTransactions = await Transaction.find({status: "Verified"}).sort({createdAt: -1});

        res.json({pendingTransactions, verifiedTransactions});
    } 
    catch(err){
        res.status(500).json({error : "Server error: " + err.message});
    }
};

//Method allowing employees to verify a pending transaction
export const verifyTransaction = async (req, res) => {
    try{
        const transaction = await Transaction.findById(req.params.id);

        if (!transaction) {
            return res.status(404).json({error: "No transaction found"});
         }

         //Verifying the transaction swift code and payee code
        const payeeValid = /^\d{10,12}$/.test(transaction.payeeAccount);
        const swiftValid = /^[A-Za-z0-9]{8,11}$/.test(transaction.swift);

       transaction.status = payeeValid && swiftValid ? "Verified" : "Rejected";

       await transaction.save();
       res.json({message: `Transaction ${transaction.status}`, transaction});
    }
    catch(err){
        res.status(500).json({error: "Server error: " + err.message});
    }
};


//Method allowing employees to submit all verified transactions to SWIFT
export const submitToSwift = async (req, res) => {
    try{
        const verifiedTransactions = await Transaction.find({status: "Verified"});

        if(verifiedTransactions.length === 0){
            return res.status(400).json({error: "No verified transactions"});
        }

        for(let tx of verifiedTransactions){
            tx.status = "Submitted to SWIFT";
            await tx.save();
        }
        res.json({message: `${verifiedTransactions.length} transactions submitted to SWIFT`});
    }
    catch(err){
        res.status(500).json({error: "Server error: " + err.message});
    }


};