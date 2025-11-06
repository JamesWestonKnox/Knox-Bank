import mongoose from "mongoose";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import Employee from "../models/Employee.js";

dotenv.config();

const employees = 
[
{fullName: "Thomas Knox" , employeeNumber: "EMP0001" , password: "@A1B2C3D4" },
{fullName: "James Knox", employeeNumber: "EMP0002" , password: "@Password1"}
];

const seed = async () => {
    try{
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("Connected to Database");
    
        for (const emp of employees){
            const passwordHash = await bcrypt.hash(emp.password, 10);

            const exists = await Employee.findOne({employeeNumber: emp.employeeNumber});
            if(!exists){
                await Employee.create({
                    fullName : emp.fullName,
                    employeeNumber : emp.employeeNumber,
                    passwordHash: passwordHash
                });
                console.log(`Created employee ${emp.employeeNumber}`);
            } 
            else{
                console.log(`Employee ${emp.employeeNumber} already exists on the system`);
            }
        }
        console.log("Seeding completed");
        process.exit();
    }catch (err){
        console.error(err);
        process.exit(1);
    }
    };

    seed()
