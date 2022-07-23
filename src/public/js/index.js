

const getIPInfo = async IP => {
  return fetch(`/api/${IP}`)
	.then(res => res.json())
	.catch(err => {
        return { "error": err }
    });
}

const $ = selector => document.querySelector(selector)

const form = $('#form')
const input = $('#input')
const submit = $('#submit')
const results = $('#results')

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const {value} = input
  if(!value) return

  submit.setAttribute('disabled', '')
  submit.setAttribute('aria-busy', 'true')

  const ipInfo = await getIPInfo(value)

  if(ipInfo.error) {
    results.innerHTML = JSON.stringify({
        "error": "An error occurred while fetching the IP info",
        "error_message": ipInfo.error,
    })
  }

  let dataStringify

  if(ipInfo) results.innerHTML = JSON.stringify(ipInfo, null, 2)

  submit.removeAttribute('disabled')
  submit.removeAttribute('aria-busy')

})


