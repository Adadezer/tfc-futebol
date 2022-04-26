import * as sinon from 'sinon';
import * as chai from 'chai';
import chaiHttp = require('chai-http');

import { app } from '../app';
import UsersModel from '../database/models/users';
import * as bcryptjs from 'bcryptjs';

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
      chaiHttpResponse = await chai.request(app).post('/login').send({
        email: 'email@email.com',
        password: '123456789'
      });
        expect(chaiHttpResponse).to.have.status(401);
        expect(chaiHttpResponse.body.message).to.be.equal('email or password not exist');
    });

    it('verifica se a senha de login está correta', async () => {
      chaiHttpResponse = await chai.request(app).post('/login').send({
        email: 'email@email.com',
        password: 'passValidoMasErrado'
      });
        expect(chaiHttpResponse).to.have.status(401);
        expect(chaiHttpResponse.body.message).to.be.equal('email or password not exist');
    });

    it('verifica se o login é válido', async () => {
      sinon
        .stub(bcryptjs, "compare")
        .resolves(true);
      
      chaiHttpResponse = await chai.request(app).post('/login').send({
        email: 'email@email.com',
        password: '123456789'
      });

      expect(chaiHttpResponse).to.have.status(200);
      expect(chaiHttpResponse.body.user).to.be.keys('id', 'username', 'role', 'email');
      expect(chaiHttpResponse.body.token).to.an('string');

      (bcryptjs.compare as sinon.SinonStub).restore();
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
  });
});