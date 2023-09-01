import {useEffect, useRef} from 'react';
import * as S from '../styles/Issue.styled';
import {useRecoilState, useRecoilValueLoadable} from 'recoil';
import {issueListAtom, issueListSelector, issuePageAtom} from '../recoil/issueState';
import IssueItem from '../components/IssueItem';
import {issueType} from '../types/IssueTypes';
import useInfiniteScroll from '../hooks/useInfiniteScroll';
import AdImage from '../components/Ad';
import IssueItemSkeleton from '../components/IssueItemSkeleton';

const IssueContainer = () => {
    const target = useRef<HTMLDivElement>(null);
    const [page, setPage] = useRecoilState(issuePageAtom);
    const [issues, setIssues] = useRecoilState<issueType[]>(issueListAtom);
    const issueListLoadable = useRecoilValueLoadable<issueType[]>(issueListSelector);

    const {count} = useInfiniteScroll({
        target: target,
        targetArray: issues,
        threshold: 0.2,
        endPoint: 3,
    });
    console.info(page);
    useEffect(() => {
        setPage(count);
    }, [count]);

    useEffect(() => {
        if (issueListLoadable.state === 'hasValue') {
            if (issues.length > 1 && page !== 1) {
                setIssues(issues => [...issues, ...issueListLoadable.contents]);
                console.info('useEffec실행', issueListLoadable.contents);
            } else setIssues(issueListLoadable.contents);
        }
    }, [issueListLoadable.contents]);

    // state가 error라면 error 페이지로 리다이렉트

    return (
        <div>
            {issues.length === 0 ? (
                Array.from({length: 10}).map((_, index) => <IssueItemSkeleton key={index} />)
            ) : (
                <S.IssueContainer>
                    <section ref={target}>
                        {issues &&
                            issues.map((issue, index) => {
                                const item = <IssueItem key={issue.number} issue={issue} />;
                                if ((index + 1) % 4 === 0) return [item, <AdImage />];

                                return item;
                            })}
                        {issueListLoadable.state === 'loading' && <div> 로딩중입니다 .....</div>}
                    </section>
                </S.IssueContainer>
            )}
            {issueListLoadable.state === 'hasError' && <div>에러페이지 이동 </div>}
        </div>
    );
};

export default IssueContainer;
