const $ = selector => document.querySelector(selector)

const form = $('#form')
const input = $('#input')
const submit = $('#submit')
const results = $('#results')

const regex = /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$|^(([a-zA-Z]|[a-zA-Z][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)*([A-Za-z]|[A-Za-z][A-Za-z0-9\-]*[A-Za-z0-9])$|^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$/;

const getIPInfo = async IP => {

  //Check if ip is valid
  if (!IP) {
    return {
      error: 'Please enter a IP address'
    }
  }

  //Check if ip is valid
  if (!regex.test(IP)) {
    return {
      error: 'Invalid IP'
    }
  }

  return fetch(`/api/${IP}`)
    .then(res => {
      console.log(res.status)
      if (res.status !== 200) {
        throw new Error(res.statusText)
      } else {
        return res.json()
      }
    })
    .catch(err => {
      input.setAttribute('aria-invalid', 'true')
      return {
        "error": err
      }
    });
}

//Check in input, when input is not focused, if the input is valid
input.addEventListener('blur', () => {
  const IP = input.value

  if (!regex.test(IP)) {
    input.setAttribute('aria-invalid', 'true')
    submit.setAttribute('disabled', '')
  } else {
    input.setAttribute('aria-invalid', 'false')
    submit.removeAttribute('disabled')
  }

})

input.addEventListener('focus', () => {
  input.removeAttribute('aria-invalid')
})

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const {
    value
  } = input
  if (!value) return

  submit.setAttribute('disabled', '')
  submit.setAttribute('aria-busy', 'true')

  const ipInfo = await getIPInfo(value)


  if (ipInfo.error) {

    input.setAttribute('aria-invalid', 'true')
    submit.removeAttribute('disabled')
    submit.removeAttribute('aria-busy')
    return results.innerHTML = JSON.stringify(ipInfo, null, 2)
  }

  if (ipInfo) results.innerHTML = JSON.stringify(ipInfo, null, 2)

  submit.removeAttribute('disabled')
  submit.removeAttribute('aria-busy')
  input.setAttribute('aria-invalid', 'false')

})
