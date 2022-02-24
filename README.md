## useState

$ 모든 let(변수)는 state로 사용
$ 변수의 값을 바꾸면 자동으로 컴포넌트에 바뀐 값이 적용됨.
$ export let => prop 상위 컴포넌트에서 하위로 전달 가능
$ export const => 하위 컴포넌트에서 상위 컴포넌트로 read only 값을 제공

## useEffect

$ use:function 으로 useEffect 비슷하게 사용 가능.. 이 부분은 아직 찾아보지 못했음
$ on:click과 같이 이벤트 등록을 on:x로 하게 되어있음
$ 데이터의 불변성을 유지해야 하는 것은 같다. array에 값을 push하거나 object의 값을 그냥 바꾸면 변경점을 감지하지 못한다.

$$ array.push xx -> array.concat oo , object.x = 1 -> object.x =2 <<- 감지 하지 못한다?
$$ 딥 카피해서 새로운 오브젝트를 할당하던가 해야함 리액트랑 똑가틈 object나 array는 주소값 비교를 통해서 값의 변경 유무를 판단하기 때문에