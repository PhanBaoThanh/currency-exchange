import './App.scss';
import icon from './img/icon.svg'
import {useState,useEffect,useRef} from 'react'

function App() {
  const data = [
    {
      name: 'USD',
      total: 200,
      icon: "$"

    },
    {
      name: 'EUR',
      total: 150,
      icon: "€"

    },
    {
      name: 'GBP',
      total: 10,
      icon: "£"
    }
  ]
  const input1Ref = useRef()
  const input2Ref = useRef()
  const [value1,setValue1] = useState(0)
  const [value2,setValue2] = useState(0)
  const [isChangeInit1,setIsChangeInit1] = useState(false)
  const [isChangeInit2,setIsChangeInit2] = useState(false)
  const [wallet1,setWallet1] = useState(data)
  const [init1,setInit1] = useState('')
  const [wallet2,setWallet2] = useState(data)
  const [init2,setInit2] = useState('')
  const [exchange,setExchange] = useState(1)

  useEffect(() => {
    const callApi = async() => {
      await fetch(`https://api.apilayer.com/exchangerates_data/latest?apikey=plniuPjmaH4WniZwqBssA0SOHRGbRvUD&symbols=${init2.name}&base=${init1.name}`)
        .then(res => res.text())
        .then(result => JSON.parse(result))
        .then(r => setExchange(r.rates[init2.name]))
    }

    if(init1 !== '' && init2 !== '')
      callApi()
  },[init1,init2])

  useEffect(() => {
    setValue2(value1 * exchange)
  },[exchange])

  const handleChangeValue1 = () => {
    setValue1(input1Ref.current.value)
    if(init1.total < input1Ref.current.value)
      setValue2()
    else
      setValue2((input1Ref.current.value * exchange).toFixed(3))
  }

  const handleChangeValue2 = () => {
    setValue2(input2Ref.current.value)
    if(init1.total < input2Ref.current.value)
      setValue1()
    else
      setValue1((input2Ref.current.value/exchange).toFixed(3))
  }

  const handleChangeInit1 = string => {
    setInit1(wallet1.find(item => item.name === string))
    setIsChangeInit1(true)
  }

  const handleChangeInit2 = string => {
    setInit2(wallet2.find(item => item.name === string))
    setIsChangeInit2(true)
  }

  const handleClickExchangeBtn = () => {
    if(init1.total >= value1 && init1.total >= value2 && value1 > 0 && value2 > 0 && value1 !== '' && value2 !== ''){
      let total1 = +init1.total - +value1
      let total2 = +init2.total + +value2
      setInit1(prev => {
        prev.total = total1.toFixed(3)
        return prev
      })
      setInit2(prev => {
        prev.total = total2.toFixed(3)
        return prev
      })
      setWallet1(wallet1.map(item => {
        if(item.name === init1.name)
          item.total = total1.toFixed(3)
        return item
      }))
      setWallet2(wallet2.map(item => {
        if(item.name === init2.name)
          item.total = total2.toFixed(3)
        return item
      }))
      setValue2(0)
      setValue1(0)
    }
  }



  return (
    <div className="w-full h-screen flex justify-center items-center bg-gray-800">
      <div className='space-y-6 text-center'>
        <h1 className='text-2xl text-gray-200 font-semibold'>Currency Exchange</h1>
        <div className="bg-white p-6 rounded-lg space-y-6 w-full md:w-96">
          <div className="flex justify-between">
            {
              data.map((item,index) => (
                <button key={index} className={`px-8 py-1 rounded text-white uppercase border border-indigo-500 ${item.name === init1.name ? 'bg-indigo-500' : 'text-indigo-500'}`} onClick={() => handleChangeInit1(item.name)}>{item.name}</button>
              ))
            }
          </div>
          {
            isChangeInit1 ? (
              <div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Balance: {init1.icon}{init1.total}</span>
                  <span className="text-gray-600">-<input ref={input1Ref} type="number" step="0.1" className={`ml-2 w-28 h-10 border px-4 py-2 rounded-md outline-none ${init1.total < value1 ? 'border-red-400' : 'border-gray-400 focus:border-indigo-500'} `} value={value1} onChange={handleChangeValue1} /></span>
                </div>
                {
                  init1.total < value1 ? (
                    <p className="text-red-400 text-right text-xs mt-2">Exceeds balance</p>
                  ) : (
                    <></>
                  )
                }
              </div>  
            ) : (
              <p className="text-gray-500 text-sm">Select your currency to exchange</p>
            )
          }
          
        </div>

        <div className='flex justify-center items-center text-white'>
          <img className="h-6 w-6 mr-4" src={icon} alt="Exchange" />
          {
            isChangeInit1 && isChangeInit2 ? (
              <span className="px-5 py-1 border rounded-xl border-white text-sm">{init1.icon}1 = {init2.icon}{exchange}</span>
            ) : (
              <></>
            )
          }
        </div>
        <div className="bg-white p-6 rounded-lg space-y-6 w-full md:w-96">
          <div className="flex justify-between">
            {
              data.map((item,index) => (
                <button key={index} className={`px-8 py-1 rounded text-white uppercase border border-indigo-500 ${item.name === init2.name ? 'bg-indigo-500' : 'text-indigo-500'}`} onClick={() => handleChangeInit2(item.name)}>{item.name}</button>
              ))
            }
          </div>
          {
            isChangeInit2 ? (
              <div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Balance: {init2.icon}{init2.total}</span>
                  <span className="text-gray-600">+<input ref={input2Ref} type="number" step="0.1" className={`ml-2 w-28 h-10 border px-4 py-2 rounded-md outline-none ${init1.total < value2 ? 'border-red-400' : 'border-gray-400 focus:border-indigo-500'} `} value={value2} onChange={handleChangeValue2} /></span>
                </div>
                {
                  init1.total < value2 ? (
                    <p className="text-red-400 text-right text-xs mt-2">Exceeds balance</p>
                  ) : (
                    <></>
                  )
                }
              </div>  
            ) : (
              <p className="text-gray-500 text-sm">Select your currency to exchange</p>
            )
          }
          
        </div>
        <button className={`w-full px-4 py-3 text-white font-semibold rounded-lg uppercase ${value1 < init1.total && value1 > 0 && value2 < init1.total && value2 > 0 ? 'bg-green-500 cursor-pointer' : 'bg-gray-400 cursor-not-allowed'} `} onClick={() => handleClickExchangeBtn()}>Exchange</button>
      </div>
    </div>
  );
}

export default App;
