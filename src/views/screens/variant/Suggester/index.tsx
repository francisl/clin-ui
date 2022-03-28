import React, { useEffect, useState } from 'react';
import { IFilter, VisualType } from '@ferlab/ui/core/components/filters/types';
import { updateFilters } from '@ferlab/ui/core/data/filters/utils';
import { AutoComplete, Input, notification, Spin } from 'antd';
import history from 'utils/history';
import generateSuggestionOptions from 'views/screens/variant/Suggester/Options';
import intl from 'react-intl-universal';

import style from 'views/screens/variant/Suggester/index.module.scss';
import { useAxiosBasicWithAuth } from 'hooks/axios';

type SuggesterProps = {
  suggestionType: string;
  placeholderText: string;
  title: string;
};

type OptionMeta = {
  meta: {
    featureType: string,
    displayName: string,
    searchText: string
  }
}

type OptionValue = {
  value: string
}

type Option = OptionValue & OptionMeta


const MIN_N_OF_CHARS_BEFORE_SEARCH = 2;
const MAX_N_OF_CHARS = 50;

const Suggester = ({ suggestionType, placeholderText }: SuggesterProps) => {
  const [options, setOptions] = useState<OptionValue[]>([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const axiosInstance = useAxiosBasicWithAuth();
  const handleSearch = async (userRawInput: string, suggestionType: string) => {
    if (userRawInput && userRawInput.length >= MIN_N_OF_CHARS_BEFORE_SEARCH) {
      setLoading(true);
      try {
        const response = await axiosInstance.get(
          `${process.env.REACT_APP_ARRANGER_API}/${suggestionType}Feature/suggestions/${userRawInput}`,
        );

        setOptions(generateSuggestionOptions(response.data.searchText, response.data.suggestions));
      } catch (e) {
        setError(true);
      } finally {
        setLoading(false);
      }
    }
  };

  const onSelectSuggestion = (featureType: string, displayType: string) => {
    let fg;
    if (featureType === 'variant') {
      fg = {
        field: 'locus',
        title: '',
        type: VisualType.Checkbox,
      };
    } else {
      fg = {
        field: 'genes.symbol',
        title: '',
        type: VisualType.Checkbox,
      };
    }

    const f: IFilter[] = [
      {
        data: {
          count: 1,
          key: displayType,
        },
        name: '',
        id: displayType,
      },
    ];
    updateFilters(history, fg, f);
  };

  useEffect(() => {
    if (error) {
      notification.error({
        message: 'Error',
        description: 'An error occurred while fetching suggestions',
        duration: null,
        onClose: () => setError(false),
      });
    }
  }, [error]);

  return (
    <AutoComplete
      className={style.suggesterInput}
      style={{ width: style.autoCompleteWidth }}
      onSearch={(searchText) => handleSearch(searchText, suggestionType)}
      options={options as Option[]}
      notFoundContent={loading ? <Spin /> : intl.get('filter.suggester.search.noresults')}
      filterOption={(inputValue, option) =>
        //  make sure we show suggestions for corresponding search only.
        (inputValue || '').trim() === option?.meta?.searchText
      }
      onSelect={(value: string, option: Option) => {
        onSelectSuggestion(option?.meta?.featureType, option.meta?.displayName);
      }}
      disabled={error}
    >
      <Input
        maxLength={MAX_N_OF_CHARS}
        allowClear
        size="middle"
        placeholder={placeholderText}
        onPressEnter={(e: any) => {
          e.preventDefault();
          const value = e.target.value;
          if (!value || !value.trim()) {
            const opt: OptionValue[] = [];
            setOptions(opt);
          }
        }}
      />
    </AutoComplete>
  );
};

export default Suggester;
