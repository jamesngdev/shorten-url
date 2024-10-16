'use client'

import React from "react";
import {useForm} from "react-hook-form";
import axios from "axios";

export default function Login() {
    const {register, handleSubmit} = useForm();
    const [isPending, setIsPending] = React.useState(false);

    const login = (value: any) => {
        setIsPending(true)
        axios.post('/api/auth', value).then(res => {
            if (!res.data?.error) {
                window.location.href = '/shorten-url'
            }
        }).catch(() => {
            alert("Login failed")
        }).finally(() => {
            setIsPending(false)
        })
    }

    return <div className="container mt-5">
        <div className="row justify-content-center">
            <div className="col-md-6">
                <div className="card">
                    <div
                        className="card-header">Login
                    </div>
                    <div className="card-body">
                        <form onSubmit={handleSubmit(data => login(data))} className="mb-3">

                            <div className="mb-3">
                                <label htmlFor="email" className="form-label">Username</label>
                                <input
                                    className="form-control"
                                    {...register("username")}
                                    placeholder="Enter your username"
                                    required
                                />
                            </div>
                            <div className="mb-3">

                                <label htmlFor="password" className="form-label">Password</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    placeholder="Enter your password"
                                    {...register("password")}
                                    required
                                />
                            </div>
                            <button type="submit" className="btn btn-primary !w-full" style={{
                                width: '100%'
                            }}>
                                {isPending ? "Loading..." : "Login"}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>

}