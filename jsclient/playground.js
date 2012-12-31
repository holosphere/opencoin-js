//////////////////////// Playground ///////////////////////////

function output(html) {
    var content = document.getElementById('content');
    content.insertAdjacentHTML('beforeend',html);
}

function pcontainer(name,container,dobencode) {
    output('<h2>'+name+'</h3>');
    output('<h3>json</h3>');
    output('<pre>'+container.toJson()+'</pre>');
    if (dobencode!=undefined) {
        output('<h3>bencoded (for signature)<h3>');
        output(container.bencode());
    }
    output('<hr>');   
}


cdd = new oc.c.CDD();
cdd.protocol_version = 'http://opencoin.org/1.0';
cdd.cdd_location = 'http://opencent.org';
cdd.issuer_public_master_key =  new oc.c.RSAPublicKey();
cdd.issuer_public_master_key.modulus = 23;
cdd.issuer_public_master_key.public_exponent = 5;
cdd.issuer_cipher_suite = 'RSA2048-SHA512-CHAUM86';
cdd.cdd_serial = 1;
cdd.cdd_signing_date = new Date("2012-12-30T11:46:00");
cdd.cdd_expiry_date = new Date("2014-12-31T23:59:59");
cdd.currency_name = 'OpenCent';
cdd.currency_divisor = 100;
cdd.validation_service = [[10,'http://opencent.org'],
                          [20,'http://opencent.com/validate']];
cdd.info_service =  [[10,'http://opencent.org']];
cdd.renewal_service =  [[10,'http://opencent.org']];
cdd.invalidation_service =  [[10,'http://opencent.org']];
cdd.denominations=[1,2,3];
cdd.additional_info='';
json1 = cdd.toJson();
bc1 = cdd.bencode();


cddc = new oc.c.CDDCertificate();
cddc.cdd = cdd
cddc.signature = 'mysignature';

pcontainer('CDD',cdd,1);
pcontainer('CDD Certificate',cddc);

mk = new oc.c.MintKey();
mk.id = '1234';
mk.issuer_id = 'abcd';
mk.cdd_serial = 1;
mk.public_mint_key = new oc.c.RSAPublicKey();
mk.public_mint_key.public_exponent = 5;
mk.public_mint_key.modulus = 23;
mk.denomination = 1;
mk.sign_coins_not_before =  new Date("2012-12-30T11:46:00");
mk.sign_coins_not_after =  new Date("2013-12-30T11:46:00");
mk.coins_expiry_date =  new Date("2014-12-30T11:46:00");
pcontainer('MintKey',mk,1);


mkc = new oc.c.MintKeyCertificate();
mkc.mint_key = mk;
mkc.signature = 'my signature';
pcontainer('MintKey Certificate',mkc);

blank = new oc.c.Blank();
blank.protocol_version = 'http://opencoin.org/1.0';
blank.issuer_id = 'abcd';
blank.cdd_location = 'http://opencent.org';
blank.denomination = 1;
blank.mint_key_id = '1234';
blank.serial = '789abc';
pcontainer('Blank',blank,1);

blind = new oc.c.Blind();
blind.reference = 'b1';
blind.blinded_token_hash = 'aaabbbccc';
blind.mint_key_id = '1234';
pcontainer('Blind',blind);

bsignature = new oc.c.BlindSignature();
bsignature.reference = 'b1';
bsignature.blind_signature = 'xxx123';
pcontainer('Blind Signature',bsignature);

coin = new oc.c.Coin();
coin.token = blank;
coin.signature = 'yyy345';
pcontainer('Coin',coin);

//messages
requestcddserial = new oc.c.RequestCDDSerial();
requestcddserial.message_reference = 1;
pcontainer('Message: Request CDD Serial',requestcddserial);

responsecddserial = new oc.c.ResponseCDDSerial();
responsecddserial.message_reference = 1;
responsecddserial.status_code = 200;
responsecddserial.status_description = 'ok';
responsecddserial.serial = 1;
pcontainer('Message: Response CDD Serial',responsecddserial);

rqcdd = new oc.c.RequestCDD();
rqcdd.message_reference = 2;
rqcdd.cdd_serial = 1;
pcontainer('Message: Request CDD',rqcdd);

rscdd = new oc.c.ResponseCDD();
rscdd.message_reference = 2;
rscdd.status_code = 200;
rscdd.status_description = 'ok';
rscdd.cdd = cdd;
pcontainer('Message: Response CDD',rscdd);

rqmk = new oc.c.RequestMintKeys();
rqmk.message_reference = 3;
rqmk.mint_key_ids = [1234];
pcontainer('Message: Request MintKeys (by id)',rqmk);

rqmk2 = new oc.c.RequestMintKeys();
rqmk2.message_reference = 3;
rqmk2.denominations = [1,2];
pcontainer('Message: Request MintKeys (by denomination)',rqmk2);

rsmk = new oc.c.ResponseMintKeys();
rsmk.message_reference = 3;
rsmk.status_code = 200;
rsmk.status_description = 'ok';
rsmk.keys = [mkc];
pcontainer('Message: Response MintKeys',rsmk);

rqv = new oc.c.RequestValidation();
rqv.message_reference = 4;
rqv.transaction_reference = 111222333;
rqv.authorization_info = 'mysecret';
rqv.tokens = [blank];
pcontainer('Message: Request validation',rqv);

rsv = new oc.c.ResponseValidation();
rsv.message_reference = 4;
rsv.status_code = 300;
rsv.status_description = 'come back later';
rsv.retry_after = new Date("2013-01-01T00:00:01");
pcontainer('Message: Response validation - delayed',rsv);

rsv2 = new oc.c.ResponseValidation();
rsv2.message_reference = 4;
rsv2.status_code = 200;
rsv2.status_description = 'ok';
rsv2.blind_signatures = [bsignature];
pcontainer('Message: Response validation - signatures',rsv2);

rqrn = new oc.c.RequestRenewal();
rqrn.message_reference = 5;
rqrn.transaction_reference = 444555666;
rqrn.coins = [coin];
rqrn.tokens = [blank];
pcontainer('Message: Request renewal',rqrn);

rsrn = new oc.c.ResponseRenewal();
rsrn.message_reference = 5;
rsrn.status_code = 300;
rsrn.status_description = 'come back later';
rsrn.retry_after = new Date("2013-01-01T00:00:01");
pcontainer('Message: Response renewal - delayed',rsrn);

rsrn2 = new oc.c.ResponseRenewal();
rsrn2.message_reference = 5;
rsrn2.status_code = 200;
rsrn2.status_description = 'ok';
rsrn2.blind_signatures = [bsignature];
pcontainer('Message: Response renewal - signatures',rsrn2);

rqiv = new oc.c.RequestInvalidation();
rqiv.message_reference = 6;
rqiv.transaction_reference = 777888999;
rqiv.authorization_info = 'myaccount';
rqiv.coins = [coin];
pcontainer('Message: Request invalidation',rqiv);

rsiv = new oc.c.ResponseInvalidation();
rsiv.message_reference = 6;
rsiv.status_code = 200;
rsiv.status_description = 'ok';
pcontainer('Message: Response invalidation',rsiv);

rqr = new oc.c.RequestResume();
rqr.message_reference = 7;
rqr.transaction_reference = 444555666;
pcontainer('Message: Request resume',rqr);

rqsc = new oc.c.SendCoins();
rqsc.message_reference = 8;
rqsc.subject = 'Payment for foobar';
rqsc.coins = [coin];
pcontainer('Message: send coins',rqsc);

rsrc = new oc.c.ReceivedCoins();
rsrc.messge_reference = 8;
rsrc.status_code = 200;
rsrc.status_description = 'ok';
pcontainer('Message: received coins',rsrc);