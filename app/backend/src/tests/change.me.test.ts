import * as sinon from 'sinon';
import * as chai from 'chai';
import chaiHttp = require('chai-http');

import { app } from '../app';
import * as bcryptjs from 'bcryptjs';
import UsersModel from '../database/models/users';
import TeamsModel from '../database/models/teams';
import { allTeams, team } from './mockTeams';

import { Response } from 'superagent';

chai.use(chaiHttp);

const { expect } = chai;

describe('ROTA LOGIN', () => {
  /**
     * Exemplo do uso de stubs com tipos
     */

  let chaiHttpResponse: Response;

  before(async () => {
    sinon
      .stub(UsersModel, "findOne")
      .resolves({
        id: 1,
        username: 'user1',
        role: 'admin',
        email: 'email@email.com',
        password: '123456789'
    } as UsersModel);
  });

  after(()=>{
    (UsersModel.findOne as sinon.SinonStub).restore();
  })

  describe('POST', () => {
    it('verifica mensagem de erro quando apenas o email é passado', async () => {
      chaiHttpResponse = await chai.request(app).post('/login').send({email: 'email@email.com'});
        expect(chaiHttpResponse).to.have.status(400);
        expect(chaiHttpResponse.body.message).to.be.equal('All fields must be filled');
    });

    it('verifica mensagem de erro quando apenas a senha é passada', async () => {
      chaiHttpResponse = await chai.request(app).post('/login').send({password: 'pass'});
        expect(chaiHttpResponse).to.have.status(400);
        expect(chaiHttpResponse.body.message).to.be.equal('All fields must be filled');
    });

    it('verifica se o email está no formato correto', async () => {
      chaiHttpResponse = await chai.request(app).post('/login').send({
        email: 'email.com.br',
        password: 'pass'
      });
        expect(chaiHttpResponse).to.have.status(401);
        expect(chaiHttpResponse.body.message).to.be.equal('Incorrect email or password');
    });

    it('verifica se a senha está no formato correto', async () => {
      chaiHttpResponse = await chai.request(app).post('/login').send({
        email: 'email@email.com',
        password: 'pass'
      });
        expect(chaiHttpResponse).to.have.status(401);
        expect(chaiHttpResponse.body.message).to.be.equal('Incorrect email or password');
    });

    it('verifica se o email de login está cadastrado', async () => {
      (UsersModel.findOne as sinon.SinonStub).restore();
      sinon
      .stub(UsersModel, "findOne")
      .resolves(null);
      
      chaiHttpResponse = await chai.request(app).post('/login').send({
        email: 'emaildfgfd@email.com',
        password: '123456789'
      });
      
      expect(chaiHttpResponse).to.have.status(401);
      expect(chaiHttpResponse.body.message).to.be.equal('email not exist');
      
    });

    it('verifica se a senha de login está correta', async () => {
      sinon
      .stub(bcryptjs, "compare")
      .resolves(false);
      
      chaiHttpResponse = await chai.request(app).post('/login').send({
        email: 'email@email.com',
        password: 'senhaErrada'
      });
      
      expect(chaiHttpResponse).to.have.status(401);
      expect(chaiHttpResponse.body.message).to.be.equal('email not exist');
    });

    it('verifica se o login é válido', async () => {
      (bcryptjs.compare as sinon.SinonStub).restore();
      (UsersModel.findOne as sinon.SinonStub).restore();
      sinon
      .stub(bcryptjs, "compare")
      .resolves(true);

      sinon
      .stub(UsersModel, "findOne")
      .resolves({
        id: 1,
        username: 'user1',
        role: 'admin',
        email: 'email@email.com',
        password: '123456789'
      } as UsersModel);
      
      chaiHttpResponse = await chai.request(app).post('/login').send({
        email: 'email@email.com',
        password: '123456789'
      });
      
      expect(chaiHttpResponse).to.have.status(200);
      expect(chaiHttpResponse.body.user).to.be.keys('id', 'username', 'role', 'email');
      expect(chaiHttpResponse.body.token).to.an('string');
    });
  });

  describe('GET', () => {
    it('caso o token não exista', async () => {
      chaiHttpResponse = await chai.request(app).get('/login/validate').send();
        expect(chaiHttpResponse).to.have.status(401);
        expect(chaiHttpResponse.body.message).to.be.equal('Token not found');
    });

    it('caso o token esteja errado', async () => {
      chaiHttpResponse = await chai.request(app).get('/login/validate')
      .set({ authorization: 'sdfnçdsfbsd' });
        expect(chaiHttpResponse).to.have.status(401);
        expect(chaiHttpResponse.body.message).to.be.equal('expired or invalid token');
    });

    it('verifica o retorno do token', async () => {
      // não precisa mockar aqui, pois o mock acima ja tem o email e o role
      chaiHttpResponse = await chai.request(app).get('/login/validate')
      .set({authorization: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoiYWRtaW5AYWRtaW4uY29tIiwiaWF0IjoxNjUwOTExNjEzLCJleHAiOjE2NTYwOTU2MTN9._HI8UvFthcoxTqDJ8LtDP2QU--H-Y_DiwvKNnjDt2SA'});
        expect(chaiHttpResponse).to.have.status(200);
        expect(chaiHttpResponse.body).to.be.equal('admin');
    });
  });
});

describe('ROTA TEAMS', () => {
  let chaiHttpResponse: Response;

  before(async () => {
    sinon
      .stub(TeamsModel, "findAll")
      .resolves(allTeams as TeamsModel[]);
  });

  after(()=>{
    (TeamsModel.findAll as sinon.SinonStub).restore();
  })

  describe('GET', () => {
    it('(/teams) => verifica se é retornado o array de times', async () => {
      chaiHttpResponse = await chai.request(app).get('/teams');

      expect(chaiHttpResponse).to.have.status(200);
      expect(chaiHttpResponse.body).to.be.deep.equal(allTeams); // deep = igualdade profunda
    });

    it('(/teams) => verifica se retorna array vazio caso os times nao forem encontrados', async () => {
      (TeamsModel.findAll as sinon.SinonStub).restore();
      sinon
        .stub(TeamsModel, "findAll")
        .resolves([] as TeamsModel[]);

      chaiHttpResponse = await chai.request(app).get('/teams');

      expect(chaiHttpResponse).to.have.status(404);
      expect(chaiHttpResponse.body.message).to.be.equal('teams not found');
    });

    it('(/teams/id) => verifica se é retornado o time pelo seu id', async () => {
      sinon
        .stub(TeamsModel, "findOne")
        .resolves(team as TeamsModel);
      chaiHttpResponse = await chai.request(app).get('/teams/:id').send({
        id: 5,
        teamName: 'Cruzeiro'
      });

      expect(chaiHttpResponse).to.have.status(200);
      expect(chaiHttpResponse.body).to.be.deep.equal(team); // deep = igualdade profunda
    });

    it('(/teams/id) => verifica se retorna erro caso o time não seja encontrado', async () => {
      (TeamsModel.findOne as sinon.SinonStub).restore();
      sinon
        .stub(TeamsModel, "findOne")
        .resolves(null);
      chaiHttpResponse = await chai.request(app).get('/teams/:id').send({
        id: 17,
        teamName: 'Time Não Encontrado'
      });

      expect(chaiHttpResponse).to.have.status(404);
      expect(chaiHttpResponse.body.message).to.be.equal('team not found');
    });
  });
});