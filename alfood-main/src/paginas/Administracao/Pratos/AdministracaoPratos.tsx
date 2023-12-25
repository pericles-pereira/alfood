import { useEffect, useState } from "react";
import { Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { Link } from "react-router-dom";
import http from "../../../http";
import IPrato from "../../../interfaces/IPrato";

const AdministracaoPratos = () => {
    const [pratos, setPratos] = useState<IPrato[]>([]);
    
    useEffect(() => {
        http.get<IPrato[]>('pratos/')
        .then(resposta => setPratos(resposta.data))
        .catch(erro => console.log(erro));
    }, []);

    const excluir = (prato: IPrato) => {
        http.delete(`pratos/${prato.id}/`)
            .then(() => {
                const listaPratos = pratos.filter(item => item.id !== prato.id)
                setPratos([ ...listaPratos ]);
            })
            .catch(erro => console.log(erro));
    }

    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>
                            Nome
                        </TableCell>
                        <TableCell>
                            Tag
                        </TableCell>
                        <TableCell>
                            Imagem
                        </TableCell>
                        <TableCell>
                            Editar
                        </TableCell>
                        <TableCell>
                            Excluir
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {pratos.map(prato => (
                        <TableRow key={prato.id}>
                            <TableCell>
                                {prato.nome}
                            </TableCell>
                            <TableCell>
                                {prato.tag}
                            </TableCell>
                            <TableCell>
                                [ {prato.imagem ? <a href={prato.imagem} target="_blank" rel="noreferrer">ver imagem</a> : 'sem imagem'} ]
                            </TableCell>

                            <TableCell>
                                [ <Link to={`/admin/Pratos/${prato.id}`}>editar</Link> ]
                            </TableCell>
                            <TableCell>
                                <Button variant="outlined" color="error" onClick={() => excluir(prato)}>
                                    Excluir
                                </Button>
                            </TableCell>
                        </TableRow>  
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}

export default AdministracaoPratos;