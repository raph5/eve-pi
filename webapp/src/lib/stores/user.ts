import type { UserData } from '@lib/user'
import { getUserData, getUserName } from '@lib/user';
import { readable } from 'svelte/store';

const userData = getUserName().then(name => getUserData(name))

const userStore = readable<Promise<UserData>>(userData)

export default userStore