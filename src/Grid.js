import React, { useEffect, useState } from 'react'
import axios from 'axios'
import xlsx from 'json-as-xlsx'
export default function Grid({ collection, fields, url }) {

  const transformResponse = resp => {
    if (!resp) return []
    let x = Object.keys(resp)
    let y = Object.values(resp)
    let temp = []
    for (let i = 0; i < x.length; i++) {
      temp.push({
        id: x[i],
        ...y[i]
      })
    }
    return temp
  }

  const transformIntoOb = (ob, status) => {
    let temp = {}
    for (let item of ob) {
      temp = { ...temp, [item]: "" }
    }

    if (status) {
      temp = { ...temp, id: "" }
    }
    return temp
  }

  const [ob1, setob1] = useState(transformIntoOb(fields, false))
  const [ob2, setob2] = useState(transformIntoOb(fields, true))
  const [b, setb] = useState([])
  const [a, seta] = useState([])

  const insert = () => {
    axios.post(`${url}${collection}.json`, ob1)
      .then(d => d.data)
      .then(d => d.name)
      .then(d => [...a, { ...ob1, id: d }])
      .then(d => seta(d))
      .catch(err => console.log(`something went wrong`))
  }

  const edit = (x) => {
    setob2(x)
  }
  const del = (id) => {
    axios.delete(`${url}${collection}/${id}.json`)
      .then(res => a.filter(x => x.id !== id))
      .then(d => seta(d))
      .catch(err => console.log(`something went wrong`))
  }
  const update = () => {
    axios.patch(`${url}${collection}/${ob2.id}.json`, ob2)
      .then(res => a.map(x => x.id === ob2.id ? ob2 : x))
      .then(d => seta(d))
      .catch(err => console.log(`something went wrong`))
      .finally(() => setob2({ id: "" }))
  }
  const handleChange1 = e => {
    let { name, value } = e.target
    setob1({ ...ob1, [name]: value })
  }

  const handleChange2 = e => {
    let { name, value } = e.target
    setob2({ ...ob2, [name]: value })
  }

  const boot = () => {
    axios.get(url + collection + ".json")
      .then(res => res.data)
      .then(d => transformResponse(d))
      .then(d => seta(d))
      .catch(err => console.log(`something went wrong :: ${err}`))
  }

  const handleFileChange = e => {
    let file = e.target.files[0]
    let fr = new FileReader()

    fr.onload = () => {
      setb(fr.result)
      console.log(fr.result)
    }

    if (file) {
      return fr.readAsText(file)
    }

  }

  const convertoob = (x, y) => {
    let temp = {}
    for (let i = 0; i < x.length; i++) {
      temp = { ...temp, [x[i]]: y[i] }
    }
    return temp
  }

  const toCSV = temp => {
    let d = temp.trim().split("\n").map(x => x.split(","))
    let f = []
    for (let i = 0; i < d.length; i++) {
      f[i] = convertoob(fields, d[i])
    }
    return f
  }


  const upload = async () => {
    setb(toCSV(b))

    let c = toCSV(b)
    // console.log(c)
    for (let item of c) {
      axios.post(`${url}${collection}.json`, item)
        .then(d => d.data)
        .then(d => d.name)
        .then(d => [...a, { ...ob1, id: d }])
        .then(d => seta(d))
        .catch(err => console.log(`something went wrong`))
    }

  }

  const download = () => {
    console.log("lkj", b)
    let data = [
      {
        sheet: "report",
        columns: fields.map(x => ({ label: x, value: x })),
        content: a,
      },
    ]

    let settings = {
      fileName: "grid-download-rs", // Name of the resulting spreadsheet
      extraLength: 3, // A bigger number means that columns will be wider
      writeOptions: {}, // Style options from https://github.com/SheetJS/sheetjs#writing-options
    }

    xlsx(data, settings)
  }


  useEffect(boot, [])

  return (
    <div>
      <div>
        <h1>export</h1>
        <button onClick={download}>export</button>
      </div>
      <div>
        <h1>import</h1>
        <input type="file" onChange={handleFileChange} />
        <button onClick={upload}>import</button>
      </div>
      <div>
        <h1>insert</h1>
        {fields.map(x => <input
          placeholder={x}
          name={x}
          value={ob1[x]}
          onChange={handleChange1}
        />)}
        <button onClick={insert}>insert</button>
      </div>

      {
        ob2.id && <div>
          <h1>edit</h1>
          {fields.map(x => <input
            placeholder={x}
            name={x}
            value={ob2[x]}
            onChange={handleChange2}
          />)}
          <button onClick={update}>update</button>
        </div>
      }

      <h1>all {collection}</h1>
      <table>
        <thead>
          <tr>
            <th>id</th>
            {fields.map(x => <th>{x}</th>)}
            <th>actions</th>
          </tr>
        </thead>

        <tbody>
          {a.map(x => <tr>
            <td>{x.id}</td>
            {fields.map(y => <td>{x[y]}</td>)}
            <td>
              <button onClick={() => edit(x)}>edit</button>
              <button onClick={() => del(x.id)}>delete</button>
            </td>
          </tr>)}
        </tbody>

      </table>

    </div >
  )
}
