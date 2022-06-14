import React from 'react'
import Grid from './Grid'
export default function App() {
    const fields = ["name"]
    const collection = "p2"
    return (
        <div>
            <Grid
                fields={fields}
                collection={collection}
                url="https://fbecomm-8bab6-default-rtdb.firebaseio.com/" />
        </div>
    )
}
