import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import {IUserModel} from "../models/userModel";

export class AuthController {
    private users: Map<string, IUserModel>;

    constructor() {
        this.users = new Map<string, IUserModel>();
        this.register = this.register.bind(this);
        this.login = this.login.bind(this);
    }

    public register = async (req: Request, res: Response) => {
        try {
            const {username, password} = req.body;
            if (!username || !password) {
                return res.status(400).json({error: 'Username and password are required'});
            }

            if (this.users.has(username)) {
                return res.status(400).json({error: 'User already exists'});
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const userId = Date.now();

            this.users.set(username, {
                id: userId,
                username: username,
                password: hashedPassword,
            });

            const token = jwt.sign(
                {userId, username},
                'secret-key',
                {expiresIn: '7d'}
            );

            res.status(201).json({
                message: 'User registered successfully',
                token,
                user: {id: userId, username}
            });
        } catch (error) {
            console.error('Registration error:', error);
            res.status(500).json({error: 'Internal server error'});
        }
    };

    public login = async (req: Request, res: Response)=> {
        try {
            const {username, password} = req.body;

            if (!username || !password) {
                return res.status(400).json({error: 'Username and password are required'});
            }

            const user = this.users.get(username);
            if (!user) {
                return res.status(401).json({error: 'Invalid credentials'});
            }

            const validPassword = await bcrypt.compare(password, user.password);
            if (!validPassword) {
                return res.status(401).json({error: 'Invalid credentials'});
            }

            const token = jwt.sign(
                {userId: user.id, username: username},
                'secret-key',
                {expiresIn: '7d'}
            );

            res.json({
                message: 'Login successful',
                token,
                user: {id: user.id, username: username}
            });
        } catch (error) {
            console.error('Login error:', error);
            res.status(500).json({error: 'Internal server error'});
        }
    }
}
