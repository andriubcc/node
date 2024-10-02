import { pool } from '../../../mysql';
import { v4 as uuid4v } from 'uuid';
import { hash, compare } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { Request, Response } from 'express';
import { verify } from 'jsonwebtoken';

class UserRepository {
    create(request: Request, response: Response){
        const { name, email, password } = request.body;
        pool.getConnection((err: any, connection: any) => {
            hash(password, 10, (err, hash) => {
                if(err) {
                    return response.status(500).json(err)
                }
                connection.query (
                    'INSERT INTO users (user_id, name, email, password) VALUES(?,?,?,?)',
                     [uuid4v(), name, email, hash],
                     (error: any, result: any, fileds: any) => {
                        connection.release();
                        if(error) {
                            return response.status(400).json(error)
                     }
                        response.status(200).json({message: 'Usuário criado com sucesso'});
                     }
                )
            })
    
        })
    }

    login(request: Request, response: Response){
        const { email, password } = request.body;
        pool.getConnection((err: any, connection: any) => {
            connection.query (
                'SELECT * FROM users WHERE email = ?',
                    [email],
                    (error: any, results: any, fileds: any) => {
                    connection.release();
                    if(error) {
                        return response.status(400).json({error: "Erro na sua autenticação"})
                    }
                        compare(password, results[0].password, (err, result) => {
                            if(err) {
                                return response.status(400).json({error: "Erro na sua acação"})
                            }
                            if(result) {
                                const token = sign({
                                    id: results[0].user_id,
                                    email: results[0].email
                                }, process.env.SECRET as string, {expiresIn: "30d"})
    
                                console.log(token)
    
                                return response.status(200).json({token: token, message: 'Autenticado com sucesso'})
                            }
                        })
                    }
            )
        })
    }

    getUser(request: any, response: any){
        const decode: any = verify(request.headers.authorization, process.env.SECRET as string);
        if(decode.email){
        pool.getConnection((error, conn) => {
            conn.query(
                'SELECT * FROM users WHERE email = ?',
                [decode.email],
                (error, resultado, fields) => {
                    conn.release();
                if(error){
                    return response.status(400).send({
                        error: error,
                        response: null
                    })
                }

                return response.status(201).send({
                    user: {
                        nome: resultado[0].name,
                        email: resultado[0].email,
                        id: resultado[0].user_id,
                    }
                })
            }
        )
        })
        }
    }

    getUserById(request: any, response: any) {
        const { user_id } = request.params;
        if (!user_id) {
            return response.status(400).send({
                error: "O parâmetro user_id é obrigatório",
                response: null
            });
        }
        pool.getConnection((error, conn) => {
            if (error) {
                return response.status(500).send({
                    error: error,
                    response: null
                });
            }
            conn.query(
                'SELECT * FROM users WHERE user_id = ?',
                [user_id],
                (error, resultado) => {
                    conn.release();
                    if (error) {
                        return response.status(500).send({
                            error: error,
                            response: null
                        });
                    }
                    if (resultado.length === 0) {
                        return response.status(404).send({
                            error: "Usuário não encontrado",
                            response: null
                        });
                    }
                    return response.status(200).send({
                        user: {
                            nome: resultado[0].name,
                            id: resultado[0].user_id,
                        }
                    });
                }
            );
        });
    }
    
}
    
export { UserRepository };