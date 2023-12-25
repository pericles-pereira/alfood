import { Box, Button, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import http from "../../../http";
import IPrato from "../../../interfaces/IPrato";
import ITag from "../../../interfaces/ITag";
import IRestaurante from "../../../interfaces/IRestaurante";

import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import styled from "@emotion/styled";

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const FormularioPrato = () => {

    const [nomePrato, setNomePrato] = useState<string>('');
    const [descricao, setDescricao] = useState<string>('');
    const [tag, setTag] = useState<string>('');
    const [restaurante, setRestaurante] = useState<number>();
    const [imagem, setImagem] = useState<File | null>(null);

    const [tags, setTags] = useState<ITag[]>([]);
    const [restaurantes, setRestaurantes] = useState<IRestaurante[]>([]);

    const [nomeImagem, setNomeImagem] = useState<string>('');

    useEffect(() => {
        http.get< { tags: ITag[] } >('tags/')
            .then(resposta => setTags(resposta.data.tags))
        http.get<IRestaurante[]>('restaurantes/')
            .then(resposta => setRestaurantes(resposta.data))
    }, []);
    
    const params = useParams();

    useEffect(() => {
        if (params.id) {
            http.get<IPrato>(`pratos/${params.id}/`)
                .then(resposta => {
                    setNomePrato(resposta.data.nome);
                    setDescricao(resposta.data.descricao);
                    setTag(resposta.data.tag);
                    setRestaurante(restaurantes[0] ? restaurantes.filter(item => item?.id === resposta.data.id)[0].id : 0);
                    setNomeImagem('Alterar Imagem');
                })
                .catch(erro => console.log(erro));
        }
    }, [params, restaurantes]);

    const selecionarArquivo = (evento: React.ChangeEvent<HTMLInputElement>) => {
        if (evento.target.files?.length) {
            setImagem(evento.target.files[0]);
            setNomeImagem(evento.target.files[0].name);
            return;
        }
        setImagem(null);
    }

    const aoSubmeterForm = (evento: React.FormEvent<HTMLFormElement>) => {
        evento.preventDefault();

        const formData = new FormData();

        formData.append('nome', nomePrato);
        formData.append('descricao', descricao);
        formData.append('tag', tag);
        formData.append('restaurante', String(restaurante));
      console.log(restaurante);
        
        if(imagem) {
            formData.append('imagem', imagem);
        }

        if (params.id) {
            http.request({
                url: `pratos/${params.id}/`,
                method: 'PUT',
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                data: formData
            })
                .then(() => alert('Prato atualizado'))
                .catch(erro => console.log(erro));
            return;
        }

        http.request({
            url: 'pratos/',
            method: 'POST',
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            data: formData
        })
            .then(() => {
                setNomePrato('');
                setDescricao('');
                setTag('');
                setRestaurante(0);
                setImagem(null);
                setNomeImagem('');
                alert('Prato cadastrado');
            })
            .catch(erro => console.log(erro));
    }

    return (
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", flexGrow: 1 }}>
            <Typography component="h1" variant="h6">Formulário de Pratos</Typography>
            <Box component="form" sx={{ width: "80%", mt: 2 }} onSubmit={aoSubmeterForm}>
                
                <TextField 
                    value={nomePrato} 
                    onChange={evento => setNomePrato(evento.target.value)} 
                    label="Nome do Prato" 
                    variant="standard"
                    fullWidth
                    required
                    margin="dense"
                />

                <TextField 
                    value={descricao} 
                    onChange={evento => setDescricao(evento.target.value)} 
                    label="Descrição do Prato" 
                    variant="standard"
                    fullWidth
                    required
                    margin="dense"
                />

                <FormControl margin="dense" variant="standard" fullWidth >
                    <InputLabel id="select-tag">Tag</InputLabel>
                    <Select labelId="select-tag" value={tag} onChange={evento => setTag(evento.target.value)}  >
                        {tags.map(tag => <MenuItem value={tag.value} key={tag.id}>
                            {tag.value}
                        </MenuItem>)}
                    </Select>
                </FormControl>

                <FormControl margin="dense" variant="standard" fullWidth >
                    <InputLabel id="select-restaurante">Restaurante</InputLabel>
                    <Select labelId="select-restaurante" value={Number(restaurante)} onChange={evento => setRestaurante(Number(evento.target.value))}  >
                        {restaurantes.map(restaurante => <MenuItem value={restaurante.id} key={restaurante.id}>
                            {restaurante.nome}
                        </MenuItem>)}
                    </Select>
                </FormControl>

                <Button component="label" sx={{ mt: 2 }} variant={imagem || nomeImagem ? "contained" : "outlined"} fullWidth startIcon={<CloudUploadIcon />}>
                    {imagem || nomeImagem ? nomeImagem : "Selecionar Imagem"}
                    <VisuallyHiddenInput type="file" onChange={selecionarArquivo} />
                </Button>

                <Button 
                    sx={{ marginTop: 1, width: "auto" }}
                    type="submit" 
                    variant="outlined"
                    fullWidth >Salvar</Button>

            </Box>
        </Box>
    )
}

export default FormularioPrato;