const year = new Date().getFullYear();
const text = `/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation ${year}. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/

`;

const match = 'Reserved'; // avoid double-prepends. if this word exists in a file, that file gets skipped.
module.exports = {
  text,
  match,
};
