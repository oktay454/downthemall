/* ***** BEGIN LICENSE BLOCK *****
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is DownThemAll text links module.
 *
 * The Initial Developer of the Original Code is Nils Maier
 * Portions created by the Initial Developer are Copyright (C) 2009
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *   Nils Maier <MaierMan@web.de>
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either the GNU General Public License Version 2 or later (the "GPL"), or
 * the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
 * in which case the provisions of the GPL or the LGPL are applicable instead
 * of those above. If you wish to allow use of your version of this file only
 * under the terms of either the GPL or the LGPL, and not to allow others to
 * use your version of this file under the terms of the MPL, indicate your
 * decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the GPL or the LGPL. If you do not delete
 * the provisions above, a recipient may use your version of this file under
 * the terms of any one of the MPL, the GPL or the LGPL.
 *
 * ***** END LICENSE BLOCK ***** */

var EXPORTED_SYMBOLS = ["getTextLinks", "FakeLink"];

const Cc = Components.classes;
const Ci = Components.interfaces;
const module = Components.utils.import;
const Exception = Components.Exception;

const regLinks = /\b(?:(?:h(?:x+|tt)?ps?|ftp):\/\/|www\d?\.)[\d\w.-]+\.\w+(?:\/[\d\w+&@#\/%?=~_|!:,.;\(\)-]*)?/ig;

function getTextLinks(text, fakeLinks) {
	return Array.map( 
		text.match(regLinks),
		function(e) {
			try {
				if (/^www/.test(e)) {
					e = "http://" + e;
				}
				e = e.replace(/^h(?:x+|tt)?p(s?)/i, "http$1").replace(/^ftp/i, "ftp");
				return fakeLinks ? new FakeLink(e) : e.toString();
			}
			catch (ex) {
				return null;
			}
		},
		this
	).filter(function(e) !!e);
}

function FakeLink (url, title) {
	this.href = url;
	if (!!title) {
		this.title = title;
	}
}
FakeLink.prototype = {
	childNodes: [],
	hasAttribute: function(attr) (attr in this),
	getAttribute: function(attr) (attr in this) ? this[attr] : null,
	toString: function() this.href
};