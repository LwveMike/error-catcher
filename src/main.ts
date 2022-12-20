import { CommonError, InteractionError} from './eventBus'


const username: any = document.getElementsByClassName('username')[0]
const btn = document.getElementsByClassName('submit-btn')[0]

btn.addEventListener('click', () => {
  if (!username.value) new InteractionError('You should complete the input and then submit')
})