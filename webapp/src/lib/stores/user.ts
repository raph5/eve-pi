import type { UserData } from '@lib/user'
import { getUserData, getUserName } from '@lib/user';
import { readable } from 'svelte/store';

const userName = await getUserName()
const userData = await getUserData(userName)

const userStore = readable<UserData>(userData)

export default userStore