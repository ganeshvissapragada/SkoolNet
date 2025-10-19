require('dotenv').config();
const { Sequelize, DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const fs = require('fs');

// Create a new Sequelize instance using the DATABASE_URL
const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    }
});

// Define User model
const User = sequelize.define('User', {
    name: DataTypes.STRING,
    email: { type: DataTypes.STRING, unique: true, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },
    role: { type: DataTypes.ENUM('admin', 'teacher', 'parent', 'student'), allowNull: false }
});

// Define Student model
const Student = sequelize.define('Student', {
    name: DataTypes.STRING,
    class: DataTypes.STRING,
    section: DataTypes.STRING,
    parent_id: { type: DataTypes.INTEGER, allowNull: true },
    user_id: { type: DataTypes.INTEGER, allowNull: true }
});

const studentData = [
    {
        name: "John Doe",
        class: "10",
        section: "A",
        gender: "Male",
        father_name: "Robert Doe",
        mother_name: "Sarah Doe"
    },
    {
        name: "Jane Smith",
        class: "10",
        section: "B",
        gender: "Female",
        father_name: "William Smith",
        mother_name: "Mary Smith"
    },
    // Add more sample data here as needed
];

async function generateEmail(name, role, attempt = 0) {
    // Convert to lowercase, replace spaces with dots, remove special characters
    const cleanName = name.toLowerCase()
        .replace(/\s+/g, '.')
        .replace(/[^a-z0-9.]/g, '');
    
    // Add timestamp and random number to ensure uniqueness
    const timestamp = Date.now().toString(36);
    const randomNum = Math.floor(Math.random() * 1000);
    const email = `${cleanName}.${timestamp}${randomNum}@school.com`;

    try {
        // Check if email exists
        const existing = await User.findOne({ where: { email } });
        if (existing && attempt < 3) {
            // Try again with a different random number
            return generateEmail(name, role, attempt + 1);
        }
    } catch (error) {
        console.error('Error checking email existence:', error);
    }

    return email;
}

async function generatePassword() {
    // Generate a random 8-character password
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let password = '';
    for (let i = 0; i < 8; i++) {
        password += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return password;
}

async function createUser(name, role, email) {
    const password = await generatePassword();
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
        name,
        email,
        password: hashedPassword,
        role
    });

    return { user, plainPassword: password };
}

async function importData() {
    try {
        await sequelize.authenticate();
        console.log('Database connection established.');

        const credentials = [];
        const parentUsers = new Map(); // Store parent users by name

        // Start a single transaction for all operations
        await sequelize.transaction(async (t) => {
            // First pass: Create parent accounts
            console.log('\nCreating parent accounts...');
            for (const data of studentData) {
                if (!parentUsers.has(data.father_name)) {
                    try {
                        const fatherEmail = await generateEmail(data.father_name, 'parent');
                        const { user: fatherUser, plainPassword: fatherPassword } = await createUser(data.father_name, 'parent', fatherEmail);
                        parentUsers.set(data.father_name, { user: fatherUser, password: fatherPassword });
                        credentials.push({
                            name: data.father_name,
                            role: 'parent',
                            email: fatherEmail,
                            password: fatherPassword
                        });
                        console.log(`Created parent account: ${data.father_name}`);
                    } catch (error) {
                        console.error(`Error creating parent account for ${data.father_name}:`, error.message);
                    }
                }
            }

            // Second pass: Create student accounts and link to parents
            console.log('\nCreating student accounts...');
            for (const data of studentData) {
                try {
                    // Get parent info
                    const parentInfo = parentUsers.get(data.father_name);
                    if (!parentInfo) {
                        throw new Error(`Parent account not found for ${data.father_name}`);
                    }

                    // Create student user
                    const studentEmail = await generateEmail(data.name, 'student');
                    const { user: studentUser, plainPassword: studentPassword } = await createUser(data.name, 'student', studentEmail);

                    // Create student record
                    const student = await Student.create({
                        name: data.name,
                        class: data.class,
                        section: data.section,
                        user_id: studentUser.id,
                        parent_id: parentInfo.user.id
                    }, { transaction: t });

                    // Add student credentials to list
                    credentials.push({
                        name: data.name,
                        role: 'student',
                        email: studentEmail,
                        password: studentPassword
                    });

                    // Credentials are already pushed in a consistent format

                    console.log(`Created student: ${data.name}`);
                } catch (error) {
                    console.error(`Error processing student ${data.name}:`, error.message);
                }
            }
        });

        // Save all credentials to a file
        const credentialsOutput = credentials.map(cred => 
            `Name: ${cred.name}
Role: ${cred.role}
Email: ${cred.email}
Password: ${cred.password}
----------------------------------------`
        ).join('\n');

        fs.writeFileSync('credentials.txt', credentialsOutput);
        console.log('\nCredentials have been saved to credentials.txt');
        console.log('Data import completed successfully.');
        process.exit(0);
    } catch (error) {
        console.error('Error importing data:', error);
        process.exit(1);
    }
}

// Run the import
importData();
