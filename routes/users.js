import express from 'express';
import {
    getUsers, getUser, createUser,
    changeUser, updateUser, deleteUser
} from '../controllers/users.js';

const router = express.Router();

router.get('/', getUsers);
router.get('/:username', getUser);
router.post('/', createUser);
router.put('/:username', changeUser);
router.patch('/:username', updateUser)
router.delete('/:username', deleteUser);

export default router;