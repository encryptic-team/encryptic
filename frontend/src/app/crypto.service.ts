import { Injectable } from '@angular/core';
import * as openpgp from 'openpgp';
import { ConfigService } from './config.service';
import * as md5 from 'md5';

@Injectable({
  providedIn: 'root'
})
export class CryptoService {

  openpgp = openpgp;
  privateKey : openpgp.PrivateKey;
  publicKey : openpgp.PublicKey;

  
  public get loaded() : boolean {
    if (this.publicKey && this.privateKey) {
      return true; 
    }
    return false;
  }
  

  constructor( private config: ConfigService) {
  }

  public hash(keyType: string) {
    var key = keyType == "public" ? this.publicKey : this.privateKey;
    return md5(key);
  }

  private getKey() {
    var success = false;
    const privateKeyArmored = localStorage.getItem("privateKeyArmored");
    const publicKeyArmored = localStorage.getItem("publicKeyArmored");
    if (privateKeyArmored && publicKeyArmored) {
      success = true;
    }
    return {success, publicKeyArmored, privateKeyArmored };
  }

  async saveKey(publicKeyArmored, privateKeyArmored) {
    console.log("entering saveKey()");
    localStorage.setItem("privateKeyArmored", privateKeyArmored);
    localStorage.setItem("publicKeyArmored", publicKeyArmored);
    if (this.config.conf && this.config.conf.meta.debug) {
      console.log(window.localStorage);
    }
  }

  async readKeys(passphrase) {
    // readKeys()
    // should this be its own function or should it be a part of the other ones?
    // it probably should just be a part of the other ones, done as needed
    const data = this.getKey();
    if (this.config.conf.meta.debug) {
      /*
      console.log("decryption:  readKeys()");
      console.log(`publicKeyArmored: ${data.publicKeyArmored}`);
      console.log(`privateKeyArmored: ${data.privateKeyArmored}`);
      */
    }
    const publicKey = await openpgp.readKey({ armoredKey: data.publicKeyArmored });
    const privateKeyUnarmored = await openpgp.readPrivateKey({ armoredKey: data.privateKeyArmored });
    const privateKey = await openpgp.decryptKey({
        privateKey: privateKeyUnarmored,
        passphrase
    });
    this.privateKey = privateKey;
    this.publicKey = publicKey;
    if (this.config.conf.meta.debug) {
      console.log(`publicKey: ${publicKey}`);
      console.log(`privateKey: ${privateKey}`);
    }
  }

  async generateKey(name, email, passphrase) {
    console.log("generating a new key!");
    const key = await openpgp.generateKey({
        type: 'rsa', // Type of the key
        rsaBits: 4096, // RSA key size (defaults to 4096 bits)
        userIDs: [{ name: name, email: email }], // you can pass multiple user IDs
        passphrase: passphrase // protects the private key
    });
    console.log(key);
    const publicKeyArmored = key.publicKeyArmored;
    const privateKeyArmored = key.privateKeyArmored; // encrypted private key
    // api call here
    this.saveKey(publicKeyArmored, privateKeyArmored);
    return {publicKeyArmored: publicKeyArmored, privateKeyArmored: privateKeyArmored};
  }

  async encrypt(message, publicKey?, privateKey?) {
    if (!publicKey) {
      publicKey = this.publicKey;
    }
    if (!privateKey) {
      privateKey = this.privateKey;
    }
    const encrypted = await openpgp.encrypt({
      message: await openpgp.createMessage({ text: message }), // input as Message object
      encryptionKeys: publicKey, // for encryption
      signingKeys: privateKey // for signing (optional)
    });
    //console.log(encrypted); 
    return {payload: encrypted};
  }

  async decrypt(encrypted, publicKey?, privateKey?) {
    if (!publicKey) {
      publicKey = this.publicKey;
    }
    if (!privateKey) {
      privateKey = this.privateKey;
    }
    console.log({encrypted, publicKey, privateKey});
    if (encrypted) {
      const message = await openpgp.readMessage({
        armoredMessage: encrypted // parse armored message
      });
      const { data: decrypted, signatures } = await openpgp.decrypt({
          message,
          verificationKeys: publicKey, // for verification (optional)
          decryptionKeys: privateKey // for decryption
      });
      console.log(decrypted); // 'Hello, World!'
      //console.log(signatures[0].valid) // signature validity (signed messages only)
      return {text: decrypted, signatures: signatures};
    }
    else {
      return {text: ""};
    }
  }

}
