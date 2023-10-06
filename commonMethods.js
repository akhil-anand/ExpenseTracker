import axios from "axios"

export const addExpenseToDB = async (req) => {
    await axios.post('https://shimmering-marsh-raisin.glitch.me/addExpense', req)
        .then(()=> console.log('data added successfully'))
        .catch((error)=> console.log(error))
//     fetch('http://192.168.0.199:19000/addExpense', {
//   method: 'POST',
//   headers: {
//     Accept: 'application/json',
//     'Content-Type': 'application/json'
//   },
//   body: JSON.stringify(req)
// });
}

export const fetchExpenseData = async (req, res) => {
    await axios.get('https://shimmering-marsh-raisin.glitch.me/getExpense')
    .then((res)=> console.log('data fetched successfully', res))
    .catch((error)=> console.log(error))
    return
}
export const fetchMonthlyExpenseData = async (req, res) => {
    await axios.get('https://shimmering-marsh-raisin.glitch.me/getMonthlyExpense')
    .then((res)=> {
      console.log('data fetched successfully', res)
      return res.data
    })
    .catch((error)=> console.log(error))
    return
}