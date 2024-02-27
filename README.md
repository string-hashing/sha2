:question: [@string-hashing/sha2](https://string-hashing.github.io/sha2)
==

SHA2 bytestring hashing for JavaScript.
See [docs](https://string-hashing.github.io/sha2/index.html).

```js
import {alloc} from '@array-like/alloc';
import * as ascii from '@codec-bytes/ascii';
import * as base16 from '@codec-bytes/base16';
import {sha512} from '@string-hashing/sha2';
const string = 'The quick brown fox jumps over the lazy dog';
const bytes = ascii.encode(string);
const digest = sha512(bytes, bytes.length * 8, alloc(64));
digest; // [0x07, 0xe5, 0x47, 0xd9, 0x58, 0x6f, 0x6a, 0x73, 0xf7, 0x3f, ...]
base16.decode(digest); // '07E547D9586F6A73F73FBAC0435ED76951218FB7D0C8D788A309D785436B...'
```

[![License](https://img.shields.io/github/license/string-hashing/sha2.svg)](https://raw.githubusercontent.com/string-hashing/sha2/main/LICENSE)
[![Version](https://img.shields.io/npm/v/@string-hashing/sha2.svg)](https://www.npmjs.org/package/@string-hashing/sha2)
[![Tests](https://img.shields.io/github/actions/workflow/status/string-hashing/sha2/ci.yml?branch=main&event=push&label=tests)](https://github.com/string-hashing/sha2/actions/workflows/ci.yml?query=branch:main)
[![Dependencies](https://img.shields.io/librariesio/github/string-hashing/sha2.svg)](https://github.com/string-hashing/sha2/network/dependencies)
[![GitHub issues](https://img.shields.io/github/issues/string-hashing/sha2.svg)](https://github.com/string-hashing/sha2/issues)
[![Downloads](https://img.shields.io/npm/dm/@string-hashing/sha2.svg)](https://www.npmjs.org/package/@string-hashing/sha2)

[![Code issues](https://img.shields.io/codeclimate/issues/string-hashing/sha2.svg)](https://codeclimate.com/github/string-hashing/sha2/issues)
[![Code maintainability](https://img.shields.io/codeclimate/maintainability/string-hashing/sha2.svg)](https://codeclimate.com/github/string-hashing/sha2/trends/churn)
[![Code coverage (cov)](https://img.shields.io/codecov/c/gh/string-hashing/sha2/main.svg)](https://codecov.io/gh/string-hashing/sha2)
[![Code technical debt](https://img.shields.io/codeclimate/tech-debt/string-hashing/sha2.svg)](https://codeclimate.com/github/string-hashing/sha2/trends/technical_debt)
[![Documentation](https://string-hashing.github.io/sha2/badge.svg)](https://string-hashing.github.io/sha2/source.html)
[![Package size](https://img.shields.io/bundlephobia/minzip/@string-hashing/sha2)](https://bundlephobia.com/result?p=@string-hashing/sha2)
