import * as stringUtil from './stringUtil';
export let stringUtil = stringUtil


import * as express from 'express';
export let express = express;


import * as path from 'path';
export let path = path;


export let router = express.Router();


import { Client } from 'node-rest-client';
export let client = new Client();
export let envUrl = process.env.API_URL || "http://apidev.giddh.com/";
//module.exports.envUrl = "http://giddh-api-dev.eu-west-1.elasticbeanstalk.com/"
//module.exports.envUrl = "http://localapi.giddh.com/"
export let googleKey = process.env.GOOGLE_KEY || "eWzLFEb_T9VrzFjgE40Bz6_l";
export let twitterKey = process.env.TWITTER_KEY || "w64afk3ZflEsdFxd6jyB9wt5j";
export let twitterSecret = process.env.TWITTER_SECRET || "62GfvL1A6FcSEJBPnw59pjVklVI4QqkvmA1uDEttNLbUl2ZRpy";
export let cdnUrl = process.env.CDN_URL || "";
//console.log process.env.CDN_URL
export let linkedinKey = process.env.LINKEDIN_KEY || "75urm0g3386r26";
export let linkedinSecret = process.env.LINKEDIN_SECRET || "3AJTvaKNOEG4ISJ0";

export let sendGridKey = 'SG.5FId5yqnSL-_oKb-_enkQg.iV8QkRJKyKK0NScGRRq-SyiHNEFCdN_kKkJ8DYS4ZUI';
export let mongoUrl = process.env.MONGODB_URL || 'mongodb://localhost/giddhDB';
export let getOtpKey = "73k6G_GDzvhy4XE33EQCaKUnC0PHwEZBvf0qsZ3Q9S3ZBcXH-f_6JT_4fH-Qx1Y5LxIIwzqy7cFQVMoyUSXBfLL5WBX6oQWifweWIQlJQ8YkRZ1lAmu3oqwvNJXP1Y5ZTXDHO1IV5-Q63zwNbzxTFw==";

import * as geoIp from 'geoip-lite';
export let geoIp = geoIp;

import * as request from 'request';
export let request = request;