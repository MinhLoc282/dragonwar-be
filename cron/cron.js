/**
 * Entry Script
 */
require('dotenv').config();
require('@babel/register');
require('@babel/polyfill');
require('./cron.entry');