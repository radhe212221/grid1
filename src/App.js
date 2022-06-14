import React from 'react'
import Grid from './Grid'
export default function App() {
    const fields = ["name", "email", "s1", "s2", "s3", "total", "result", "dt"]
    const collection = "p3"
    return (
        <div>
            <Grid
                fields={fields}
                collection={collection}
                url="https://fbecomm-8bab6-default-rtdb.firebaseio.com/" />
        </div>
    )
}
