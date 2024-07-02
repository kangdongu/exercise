# Habit
![Habit](https://github.com/kangdongu/exercise/assets/162076741/b0a85213-7f34-4654-aacb-69eb5c4e55b7)


Habit은 운동습관을 만들어 주기위한 앱입니다. <br />
운동습관은 체력, 근력, 체지방같이 외적인 부분뿐만 아니라<br /> 
내가 하기로한 운동을 실천하면서 무기력함을 없애고 나에대한 신뢰, 성공습관, 자존감을 상승시켜주며 많은 사람들의 삶에 도움을 주기위한 앱입니다.

### React + TypeScript + Vite + Firebase 
React + TypeScript + Vite + Firebase를 이용하였고 

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default {
  // other rules...
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json', './tsconfig.node.json'],
    tsconfigRootDir: __dirname,
  },
}
```

- Replace `plugin:@typescript-eslint/recommended` to `plugin:@typescript-eslint/recommended-type-checked` or `plugin:@typescript-eslint/strict-type-checked`
- Optionally add `plugin:@typescript-eslint/stylistic-type-checked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and add `plugin:react/recommended` & `plugin:react/jsx-runtime` to the `extends` list
