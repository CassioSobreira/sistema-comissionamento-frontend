import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Colaborador } from '../domain/customer';

@Injectable()
export class CustomerService {

    constructor(private http: HttpClient) { }

    // O método agora retorna uma Promise com um array de Colaborador.
    getColaboradores() {
        const data: Colaborador[] = [
            { id: 1, nome: 'Ana Silva', cargo: 'Desenvolvedora Frontend', sexo: 'Feminino', email: 'ana.silva@email.com', modulo: 'Comissionamento' },
            { id: 2, nome: 'Bruno Costa', cargo: 'Desenvolvedor Backend', sexo: 'Masculino', email: 'bruno.costa@email.com', modulo: 'Financeiro' },
            { id: 3, nome: 'Carla Dias', cargo: 'UI/UX Designer', sexo: 'Feminino', email: 'carla.dias@email.com', modulo: 'Design' },
            { id: 4, nome: 'Daniel Martins', cargo: 'Gerente de Projetos', sexo: 'Masculino', email: 'daniel.martins@email.com', modulo: 'Gestão' },
            { id: 5, nome: 'Elena Souza', cargo: 'Analista de QA', sexo: 'Feminino', email: 'elena.souza@email.com', modulo: 'Qualidade' },
            { id: 6, nome: 'Felipe Santos', cargo: 'DevOps', sexo: 'Masculino', email: 'felipe.santos@email.com', modulo: 'Infraestrutura' },
            { id: 7, nome: 'Gabriela Lima', cargo: 'Desenvolvedora Frontend', sexo: 'Feminino', email: 'gabriela.lima@email.com', modulo: 'Comissionamento' },
            { id: 8, nome: 'Heitor Almeida', cargo: 'Analista de Sistemas', sexo: 'Masculino', email: 'heitor.almeida@email.com', modulo: 'Financeiro' },
            { id: 9, nome: 'Isabela Pereira', cargo: 'Scrum Master', sexo: 'Feminino', email: 'isabela.pereira@email.com', modulo: 'Gestão' },
            { id: 10, nome: 'João Ferreira', cargo: 'Desenvolvedor Fullstack', sexo: 'Masculino', email: 'joao.ferreira@email.com', modulo: 'Comissionamento' },
            { id: 11, nome: 'Larissa Oliveira', cargo: 'Analista de Dados', sexo: 'Feminino', email: 'larissa.oliveira@email.com', modulo: 'Business Intelligence' },
            { id: 12, nome: 'Marcos Ribeiro', cargo: 'Arquiteto de Software', sexo: 'Masculino', email: 'marcos.ribeiro@email.com', modulo: 'Arquitetura' },
            { id: 13, nome: 'Natália Rodrigues', cargo: 'Desenvolvedora Mobile', sexo: 'Feminino', email: 'natalia.rodrigues@email.com', modulo: 'Mobile' },
            { id: 14, nome: 'Otávio Gomes', cargo: 'Analista de Segurança', sexo: 'Masculino', email: 'otavio.gomes@email.com', modulo: 'Segurança' },
            { id: 15, nome: 'Patrícia Azevedo', cargo: 'Product Owner', sexo: 'Feminino', email: 'patricia.azevedo@email.com', modulo: 'Gestão' },
            { id: 16, nome: 'Rafael Barbosa', cargo: 'Desenvolvedor Backend', sexo: 'Masculino', email: 'rafael.barbosa@email.com', modulo: 'Financeiro' },
            { id: 17, nome: 'Sofia Cardoso', cargo: 'UI/UX Designer', sexo: 'Feminino', email: 'sofia.cardoso@email.com', modulo: 'Design' },
            { id: 18, nome: 'Tiago Monteiro', cargo: 'Analista de QA', sexo: 'Masculino', email: 'tiago.monteiro@email.com', modulo: 'Qualidade' },
            { id: 19, nome: 'Vanessa Castro', cargo: 'Desenvolvedora Frontend', sexo: 'Feminino', email: 'vanessa.castro@email.com', modulo: 'Comissionamento' },
            { id: 20, nome: 'William Moraes', cargo: 'DevOps', sexo: 'Masculino', email: 'william.moraes@email.com', modulo: 'Infraestrutura' },
            { id: 21, nome: 'Amanda Nunes', cargo: 'Gerente de Projetos', sexo: 'Feminino', email: 'amanda.nunes@email.com', modulo: 'Gestão' },
            { id: 22, nome: 'Bernardo Rocha', cargo: 'Desenvolvedor Fullstack', sexo: 'Masculino', email: 'bernardo.rocha@email.com', modulo: 'Financeiro' },
            { id: 23, nome: 'Clara Pinto', cargo: 'Analista de Dados', sexo: 'Feminino', email: 'clara.pinto@email.com', modulo: 'Business Intelligence' },
            { id: 24, nome: 'Davi Cunha', cargo: 'Arquiteto de Software', sexo: 'Masculino', email: 'davi.cunha@email.com', modulo: 'Arquitetura' },
            { id: 25, nome: 'Eduarda Teixeira', cargo: 'Desenvolvedora Mobile', sexo: 'Feminino', email: 'eduarda.teixeira@email.com', modulo: 'Mobile' },
            { id: 26, nome: 'Francisco Melo', cargo: 'Analista de Segurança', sexo: 'Masculino', email: 'francisco.melo@email.com', modulo: 'Segurança' },
            { id: 27, nome: 'Giovanna Barros', cargo: 'Product Owner', sexo: 'Feminino', email: 'giovanna.barros@email.com', modulo: 'Gestão' },
            { id: 28, nome: 'Hugo Viana', cargo: 'Desenvolvedor Backend', sexo: 'Masculino', email: 'hugo.viana@email.com', modulo: 'Comissionamento' },
            { id: 29, nome: 'Igor Freitas', cargo: 'UI/UX Designer', sexo: 'Masculino', email: 'igor.freitas@email.com', modulo: 'Design' },
            { id: 30, nome: 'Júlia Lopes', cargo: 'Analista de QA', sexo: 'Feminino', email: 'julia.lopes@email.com', modulo: 'Qualidade' },
            { id: 31, nome: 'Kevin Ramos', cargo: 'DevOps', sexo: 'Masculino', email: 'kevin.ramos@email.com', modulo: 'Infraestrutura' },
            { id: 32, nome: 'Lívia Sousa', cargo: 'Desenvolvedora Frontend', sexo: 'Feminino', email: 'livia.sousa@email.com', modulo: 'Financeiro' },
            { id: 33, nome: 'Miguel Correia', cargo: 'Analista de Sistemas', sexo: 'Masculino', email: 'miguel.correia@email.com', modulo: 'Gestão' },
            { id: 34, nome: 'Manuela Azevedo', cargo: 'Scrum Master', sexo: 'Feminino', email: 'manuela.azevedo@email.com', modulo: 'Gestão' },
            { id: 35, nome: 'Nicolas Duarte', cargo: 'Desenvolvedor Fullstack', sexo: 'Masculino', email: 'nicolas.duarte@email.com', modulo: 'Comissionamento' },
            { id: 36, nome: 'Olívia Peixoto', cargo: 'Analista de Dados', sexo: 'Feminino', email: 'olivia.peixoto@email.com', modulo: 'Business Intelligence' },
            { id: 37, nome: 'Pedro Henrique Fogaça', cargo: 'Arquiteto de Software', sexo: 'Masculino', email: 'pedro.fogaca@email.com', modulo: 'Arquitetura' },
            { id: 38, nome: 'Quitória Neves', cargo: 'Desenvolvedora Mobile', sexo: 'Feminino', email: 'quitoria.neves@email.com', modulo: 'Mobile' },
            { id: 39, nome: 'Rodrigo Pires', cargo: 'Analista de Segurança', sexo: 'Masculino', email: 'rodrigo.pires@email.com', modulo: 'Segurança' },
            { id: 40, nome: 'Sarah Campos', cargo: 'Product Owner', sexo: 'Feminino', email: 'sarah.campos@email.com', modulo: 'Gestão' },
            { id: 41, nome: 'Thales Moreira', cargo: 'Desenvolvedor Backend', sexo: 'Masculino', email: 'thales.moreira@email.com', modulo: 'Financeiro' },
            { id: 42, nome: 'Úrsula Fernandes', cargo: 'UI/UX Designer', sexo: 'Feminino', email: 'ursula.fernandes@email.com', modulo: 'Design' },
            { id: 43, nome: 'Vinícius Matos', cargo: 'Analista de QA', sexo: 'Masculino', email: 'vinicius.matos@email.com', modulo: 'Qualidade' },
            { id: 44, nome: 'Yasmin Reis', cargo: 'Desenvolvedora Frontend', sexo: 'Feminino', email: 'yasmin.reis@email.com', modulo: 'Comissionamento' },
            { id: 45, nome: 'Ziraldo Alves', cargo: 'DevOps', sexo: 'Masculino', email: 'ziraldo.alves@email.com', modulo: 'Infraestrutura' },
            { id: 46, nome: 'Bárbara Borges', cargo: 'Gerente de Projetos', sexo: 'Feminino', email: 'barbara.borges@email.com', modulo: 'Gestão' },
            { id: 47, nome: 'Caio Rezende', cargo: 'Desenvolvedor Fullstack', sexo: 'Masculino', email: 'caio.rezende@email.com', modulo: 'Financeiro' },
            { id: 48, nome: 'Débora Nogueira', cargo: 'Analista de Dados', sexo: 'Feminino', email: 'debora.nogueira@email.com', modulo: 'Business Intelligence' },
            { id: 49, nome: 'Erick Siqueira', cargo: 'Arquiteto de Software', sexo: 'Masculino', email: 'erick.siqueira@email.com', modulo: 'Arquitetura' },
            { id: 50, nome: 'Flávia Drummond', cargo: 'Desenvolvedora Mobile', sexo: 'Feminino', email: 'flavia.drummond@email.com', modulo: 'Mobile' }
        ];
        // Retornamos os dados dentro de uma Promise para simular uma chamada de API
        return Promise.resolve(data);
    }
}

