import { GetStaticPaths, GetStaticProps } from 'next';

// import { getPrismicClient } from '../../services/prismic';

// import commonStyles from '../../styles/common.module.scss';
// import styles from './post.module.scss';

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

export default function Post(props: PostProps): JSX.Element {
  const { post } = props;
  console.log(post);
  // TODO
  return (
    <div>
      {/* <div className={commonStyles.banner}>
        <img src="/images/banner.png" alt="" />
      </div>
      <div className={commonStyles.container}>
        <main className={styles.main}>
          <section className={styles.sectionContent}>
            <h1>Criando um app CRA do zero</h1>
            <span>15 Mar 2021</span>
            <span>Joseph Oliveira</span>
            <span>4 min</span>

            <p>
              <h4>Proin et varius</h4>
              <br />
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              <br />
              <br />
              Nullam dolor sapien, vulputate eu diam at, condimentum hendrerit
              tellus. Nam facilisis sodales felis, pharetra pharetra lectus
              auctor sed.
              <br />
              <br />
              Ut venenatis mauris vel libero pretium, et pretium ligula
              faucibus. Morbi nibh felis, elementum a posuere et, vulputate et
              erat. Nam venenatis.
            </p>
          </section>
        </main>
      </div> */}
    </div>
  );
}

// export const getStaticPaths: GetStaticPaths = async () => {
//   // const prismic = getPrismicClient();
//   // const posts = await prismic.query(TODO);
//   // TODO
// };

export const getStaticProps: GetStaticProps = async context => {
  // const prismic = getPrismicClient();
  // const response = await prismic.getByUID(TODO);
  // TODO
  return {
    props: {
      post: '',
    },
  };
};
