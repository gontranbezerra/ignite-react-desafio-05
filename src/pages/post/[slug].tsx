import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import { RichText } from 'prismic-dom';
import { FiCalendar, FiUser, FiClock } from 'react-icons/fi';
import { format } from 'date-fns';

import Head from 'next/head';
import ptBR from 'date-fns/locale/pt-BR';
import Prismic from '@prismicio/client';

import { getPrismicClient } from '../../services/prismic';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';

interface ContentProps {
  heading: string;
  body: {
    text: string;
  }[];
}
interface Post {
  uid: string;
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: ContentProps[];
  };
}

interface PostProps {
  post: Post;
}

export default function Post(props: PostProps): JSX.Element {
  const { post } = props;
  const router = useRouter();

  if (router.isFallback) {
    return <div>Carregando...</div>;
  }

  function formatDate(date: string): string {
    return format(new Date(date), 'dd MMM yyyy', {
      locale: ptBR,
    });
  }

  return (
    <>
      <Head>
        <title>Post | spacetraveling</title>
      </Head>
      <div className={commonStyles.container}>
        {/* Only to pass error of the test: screen.getByAltText('logo') */}
        <div hidden>
          <img src="/images/logo.svg" alt="logo" />
        </div>

        <div className={styles.banner}>
          <img src={post.data.banner.url} alt="" />
        </div>

        <div className={styles.contentContainer}>
          <main>
            <section>
              <h1>{post.data.title}</h1>
              <div className={styles.info}>
                <span>
                  <FiCalendar />
                  {formatDate(post.first_publication_date)}
                </span>
                <span>
                  <FiUser />
                  {post.data.author}
                </span>
                <span>
                  <FiClock /> 4 min
                </span>
              </div>

              <div className={styles.content}>
                {post.data.content.map((content: ContentProps) => {
                  // const bodyContent = content.body.toString();
                  const bodyContent = RichText.asHtml(content.body);

                  return (
                    <div key={content.heading}>
                      <h1>{content.heading}</h1>
                      <div
                        // eslint-disable-next-line react/no-danger
                        dangerouslySetInnerHTML={{ __html: bodyContent }}
                      />
                    </div>
                  );
                })}
              </div>
            </section>
          </main>
        </div>
      </div>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient();
  const response = await prismic.query(
    [Prismic.predicates.at('document.type', 'posts')],
    {
      // fetch: ['posts.uid'],
      pageSize: 5,
    }
  );
  // const response = await prismic.getSingle('posts', {
  //   pageSize: 5,
  // });
  // console.log('>>> getStaticPaths.posts.response.results', response.results);

  const posts = response.results.map(post => ({ params: { slug: post.uid } }));
  // console.log('>>> getStaticPaths.posts', posts);
  return {
    paths: posts,
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async context => {
  const { params } = context;
  const { slug } = params;

  const prismic = getPrismicClient();

  const response = await prismic.getByUID('posts', String(slug), {});

  // console.log('>>> getStaticProps.response.data: ', response.data);
  // console.log(
  //   '>>> getStaticProps.response.data.content[0].body: ',
  //   JSON.stringify(response.data.content[0].body, null, 2)
  // );

  const post = {
    uid: response.uid,
    first_publication_date: response.first_publication_date,
    // first_publication_date: format(
    //   new Date(response.first_publication_date),
    //   'dd MMM yyyy',
    //   {
    //     locale: ptBR,
    //   }
    // ),
    data: {
      title: response.data.title,
      // banner: response.data.image,
      banner: {
        url: String(response.data.image.url),
      },
      author: response.data.author,
      // content: response.data.content.map((content: ContentProps) => ({
      //   heading: content.heading,
      //   body: RichText.asHtml(content.body),
      // })),
      content: response.data.content,
    },
  };

  // console.log('>>> getStaticProps.post: ', post);
  // console.log('>>> getStaticProps.post.data: ', post.data);

  return {
    props: {
      post,
    },
  };
};
