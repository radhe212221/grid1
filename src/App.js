import React from 'react'
import Grid from './Grid'
export default function App() {
    const fields = ["name", "email","phone","pass","conf","gender","country","city","state","pincode"]
    const collection = "p1"
    return (
        <div>
            <Grid
                fields={fields}
                collection={collection}
                url="https://fbecomm-8bab6-default-rtdb.firebaseio.com/" />
        </div>
    )
}
