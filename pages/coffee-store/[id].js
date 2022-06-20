import Link from "next/link";
import {useRouter} from "next/router";
import Head from "next/head";
import styles from "../../styles/coffee-store.module.css";
import Image from "next/image";
import cls from "classnames";
import {useState} from "react";
import {fetchCoffeeStores} from "../../lib/coffee-stores";

export async function getStaticProps({ params }) {
	const coffeeStores = await fetchCoffeeStores()
	return {
		props: {
			coffeeStore: coffeeStores.find(coffeeStore => {
				return coffeeStore.fsq_id === params.id
			})
		}
	}
}

export async function getStaticPaths() {
	const coffeeStores = await fetchCoffeeStores()
	const paths = coffeeStores.map(coffeeStore => ({
			params: { id: coffeeStore.fsq_id }
		}))

	return {
		paths,
		fallback: true
	}
}

const CoffeeStore = (props) => {
	const router = useRouter()

	if (router.isFallback) {
		return <div>Loading...</div>
	}

	const { formatted_address = "" } = props.coffeeStore.location

	const {
		name = "",
		distance = "",
		imgUrl = "",
	} = props.coffeeStore;

	const [votingCount, setVotingCount] = useState(0);

	const handleUpvoteButton = () => {
		console.log('asd')
	}

	return (
		<div className={styles.layout}>
			<Head>
				<title>{name}</title>
				<meta name="description" content={`${name} coffee store`} />
			</Head>
			<div className={styles.container}>
				<div className={styles.col1}>
					<div className={styles.backToHomeLink}>
						<Link href="/">
							<a>← Back to home</a>
						</Link>
					</div>
					<div className={styles.nameWrapper}>
						<h1 className={styles.name}>{name}</h1>
					</div>
					<Image
						src={
							imgUrl ||
							"https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80"
						}
						width={600}
						height={360}
						className={styles.storeImg}
						alt={name}
					/>
				</div>

				<div className={cls("glass", styles.col2)}>
					{formatted_address && (
						<div className={styles.iconWrapper}>
							<Image
								src="/static/icons/places.svg"
								width="24"
								height="24"
								alt="places icon"
							/>
							<p className={styles.text}>{formatted_address}</p>
						</div>
					)}
					{distance && (
						<div className={styles.iconWrapper}>
							<Image
								src="/static/icons/nearMe.svg"
								width="24"
								height="24"
								alt="near me icon"
							/>
							<p className={styles.text}>{distance}</p>
						</div>
					)}
					<div className={styles.iconWrapper}>
						<Image
							src="/static/icons/star.svg"
							width="24"
							height="24"
							alt="star icon"
						/>
						<p className={styles.text}>{votingCount}</p>
					</div>

					<button className={styles.upvoteButton} onClick={handleUpvoteButton}>
						Up vote!
					</button>
				</div>
			</div>
		</div>
	)
}

export default CoffeeStore