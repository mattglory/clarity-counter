\# 🧮 Clarity Counter



\## Overview



\*\*Clarity Counter\*\* is a secure, owner-controlled smart contract built on the \[Stacks blockchain](https://www.stacks.co/) using \[Clarity](https://docs.stacks.co/docs/clarity-language/overview). It demonstrates core smart contract principles including access control, state management, and robust testing.



This project is designed to be beginner-friendly, grant-eligible, and ready for extension into real-world applications.



\## ✨ Features



\- ✅ Owner-only access to increment and reset functions

\- 🔒 Access control with error handling (`err u100`)

\- 🧪 Full test suite using Clarinet + Vitest

\- 📦 Clean project structure and documentation

\- 🚀 Ready for grant submission and monthly entry



\## 📜 Contract Functions



| Function         | Type        | Description                                      |

|------------------|-------------|--------------------------------------------------|

| `get-count`      | Read-only   | Returns the current counter value               |

| `get-owner`      | Read-only   | Returns the hardcoded contract owner            |

| `is-owner`       | Read-only   | Checks if a principal is the owner              |

| `count-up`       | Public      | Increments the counter (owner only)             |

| `reset-counter`  | Public      | Resets the counter to zero (owner only)         |



\## 🧪 Testing



Run tests with:



```bash

npm install

npm test

