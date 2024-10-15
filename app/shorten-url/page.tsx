"use client"
import React, {useEffect} from "react";
import axios from "axios"
import {useForm} from "react-hook-form";


export default function ShortenURL() {
    const [isPending, setIsPending] = React.useState(false);
    const [refetch, setRefetch] = React.useState(0);
    const {register, handleSubmit, reset} = useForm();
    const [error, setError] = React.useState("");

    const createShortURL = async (values: any) => {
        setError("")
        setIsPending(true);
        const response = await axios.post("/api/shorten-url", values).then(res => res.data).catch(() => undefined)
        if (!response) {
            setIsPending(false);
            setError("Link rut ngon bi trung")
            return
        }

        setIsPending(false);
        setRefetch(refetch + 1);
        reset()
    }


    const [query, setQuery] = React.useState("");
    const [rows, setRows] = React.useState<any[]>([]);

    useEffect(() => {
        const params: any = {}
        if (query) {
            params.query = query
        }
        setIsPending(true)
        axios.get('/api/shorten-url', {
            params
        }).then(res => {
            setRows(res.data)
        }).catch(err => {
            console.error(err)
        }).finally(() => {
            setIsPending(false)
        })
    }, [query, refetch])

    const handleDelete = (id: any) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        window.confirm("Are you sure you want to delete this item?") && axios.delete(`/api/shorten-url/${id}`).then(() => {
            setRefetch(refetch + 1)
        }).catch(err => {
            console.error(err)
            alert("Failed to delete item")
        })
    }

    return (
        <div className="container mt-10">
            <div className="row mt-10" style={{
                marginTop: 50
            }}>
                <div className="col-md-4">
                    <div className="card">
                        <div className="card-body">
                            <form onSubmit={handleSubmit(data => createShortURL(data))} className="mb-3">
                                <div className="mb-3">
                                    <label htmlFor="url" className="form-label">URL</label>
                                    <input type="text" {...register("url")} className="form-control"/>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="shorten_url" className="form-label">Shorten URL</label>
                                    <input type="text" {...register("shorten_url")} className="form-control"
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="title" className="form-label">Title</label>
                                    <input type="text" {...register("title")} className="form-control"
                                    />

                                </div>
                                <div className="mb-3">
                                    <label htmlFor="description" className="form-label">Description</label>
                                    <input type="text" className="form-control" id="description"
                                           {...register("description")} />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="image" className="form-label">Image</label>
                                    <input type="text" className="form-control" id="image"
                                           {...register("image")} />
                                </div>

                                {error && (
                                    <div className="alert alert-danger" role="alert">
                                        {error}
                                    </div>
                                )}

                                <button type="submit" className="btn btn-primary block" style={{
                                    width: "100%"
                                }}>
                                    {isPending ? "Loading..." : "Submit"}
                                </button>
                            </form>
                        </div>
                    </div>

                </div>
                <div className="col-md-8">
                    <div className="card">
                        <div className="card-body">
                            <div className="mb-3">
                                <input type="text" className="form-control" id="query" placeholder="Search"
                                       value={query}
                                       onChange={(e) => setQuery(e.target.value)}/>
                            </div>
                            <table className="table">
                                <thead>
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">Shorten URL</th>
                                    <th scope="col">Fake URL</th>
                                    <th scope="col">Real URL</th>
                                    <th scope="col">Total Views</th>
                                    <th scope="col">Actions</th>
                                </tr>
                                </thead>
                                <tbody>
                                {(rows || []).map((row, index) => (
                                    <tr key={row.id}>
                                        <td>{index + 1}</td>
                                        <td>
                                            <a href={row.shorten_url} target="_blank">
                                                {row.shorten_url}
                                            </a>
                                        </td>
                                        <td>
                                            <div className="d-flex gap-3">
                                                <img
                                                    src={row.image}
                                                    alt={row.title}
                                                    style={{
                                                        width: 100,
                                                        height: 100,
                                                    }}
                                                />
                                                <div>
                                                    <h5>{row.title}</h5>
                                                    <p>{row.description}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <a href={row.url} target="_blank">
                                                {row.url}
                                            </a>
                                        </td>
                                        <td>{row.total_views}</td>
                                        <td>

                                            <button className="btn btn-sm btn-danger"
                                                    onClick={() => handleDelete(row.shorten_url)}>
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
