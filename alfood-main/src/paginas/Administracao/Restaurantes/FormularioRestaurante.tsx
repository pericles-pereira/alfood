import { Box, Button, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import IRestaurante from "../../../interfaces/IRestaurante";
import http from "../../../http";


const FormularioRestaurante = () => {
    
    const params = useParams();

    useEffect(() => {
        if (params.id) {
            http.get<IRestaurante>(`restaurantes/${params.id}/`)
                .then(resposta => setNomeRestaurante(resposta.data.nome))
        }
    }, [params]);

    const [nomeRestaurante, setNomeRestaurante] = useState<string>('');

    const aoSubmeterForm = (evento: React.FormEvent<HTMLFormElement>) => {
        evento.preventDefault();

        if (params.id) {
            http.put(`restaurantes/${params.id}/`, {
                nome: nomeRestaurante
                })
                .then(() => alert('Restaurante atualizado'))
                .catch(erro => {
                    console.log(erro);
                });
            return;
        }

        http.post('restaurantes/', {
            nome: nomeRestaurante
            })
            .then(() => {
                setNomeRestaurante('')
                alert('Restaurante cadastrado')
            })
            .catch(erro => {
                console.log(erro);
            });
    }

    return (
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", flexGrow: 1 }}>
            <Typography component="h1" variant="h6">Formulário de Restaurantes</Typography>
            <Box component="form" sx={{ width: "80%", mt: 2 }} onSubmit={aoSubmeterForm}>
                
                <TextField 
                    value={nomeRestaurante} 
                    onChange={evento => setNomeRestaurante(evento.target.value)} 
                    label="Nome do Restaurante" 
                    variant="standard"
                    fullWidth
                    required
                />
                <Button 
                    sx={{ marginTop: 1, width: "auto" }}
                    type="submit" 
                    variant="outlined"
                    fullWidth >Salvar</Button>

            </Box>
        </Box>
    )
}

export default FormularioRestaurante;